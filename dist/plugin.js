var chartjs2music = (function (c2mChart) {
    'use strict';

    const calcMedian = (nums) => (nums.length % 2) ? nums[Math.floor(nums.length / 2)] : (nums[nums.length / 2] + nums[nums.length / 2 - 1]) / 2;
    const fiveNumberSummary = (nums) => {
        const sortedNumbers = nums.sort();
        let min, max, q1, q3;
        const datamin = Math.min(...sortedNumbers);
        const datamax = Math.max(...sortedNumbers);
        const median = calcMedian(sortedNumbers);
        const length = sortedNumbers.length;
        if (length % 2) {
            q1 = calcMedian(sortedNumbers.slice(0, Math.floor(length / 2)));
            q3 = calcMedian(sortedNumbers.slice(Math.ceil(length % 2)));
        }
        else {
            q1 = calcMedian(sortedNumbers.slice(0, length / 2 - 1));
            q3 = calcMedian(sortedNumbers.slice(length / 2));
        }
        const iqr = q3 - q1;
        if (datamax < q3 + iqr) {
            max = datamax;
        }
        else {
            max = sortedNumbers.reverse().find((num) => num < datamax) ?? datamax;
        }
        if (datamin < q1 - iqr) {
            min = datamin;
        }
        else {
            min = sortedNumbers.reverse().find((num) => num < datamin) ?? datamin;
        }
        const outlier = sortedNumbers.filter((num) => num < min || num > max);
        return {
            low: min,
            high: max,
            median,
            q1,
            q3,
            ...(outlier.length > 0 ? { outlier } : {})
        };
    };
    const whichBoxData = (data) => {
        return data.map((row, index) => {
            if (typeof row === "object" && "min" in row) {
                return {
                    ...row,
                    low: row.min,
                    high: row.max,
                    x: index,
                    ...("outliers" in row ? { outlier: row.outliers } : {})
                };
            }
            if (Array.isArray(row)) {
                return {
                    ...fiveNumberSummary(row),
                    x: index
                };
            }
        });
    };
    const processBoxData = (data) => {
        if (data.datasets.length === 1) {
            return {
                data: whichBoxData(data.datasets[0].data)
            };
        }
        const groups = [];
        const result = {};
        data.datasets.forEach((obj, index) => {
            const groupName = obj.label ?? `Group ${index + 1}`;
            groups.push(groupName);
            result[groupName] = whichBoxData(obj.data);
        });
        return { groups, data: result };
    };

    const chartStates = new Map();
    const chartjs_c2m_converter = {
        bar: "bar",
        line: "line",
        pie: "pie",
        polarArea: "bar",
        doughnut: "pie",
        boxplot: "box",
        radar: "bar",
        wordCloud: "bar",
        scatter: "scatter"
    };
    const processChartType = (chart) => {
        const topLevelType = chart.config.type;
        const panelTypes = chart.data.datasets.map(({ type }) => type ?? topLevelType);
        const invalid = panelTypes.find((t) => !(t in chartjs_c2m_converter));
        if (invalid) {
            return {
                valid: false,
                invalidType: invalid
            };
        }
        if ([...new Set(panelTypes)].length === 1) {
            return {
                valid: true,
                c2m_types: chartjs_c2m_converter[panelTypes[0]]
            };
        }
        return {
            valid: true,
            c2m_types: panelTypes.map((t) => chartjs_c2m_converter[t])
        };
    };
    const generateAxisInfo = (chartAxisInfo, chart) => {
        const axis = {};
        if (chartAxisInfo?.min) {
            if (typeof chartAxisInfo.min === "string") {
                axis.minimum = chart.data.labels.indexOf(chartAxisInfo.min);
            }
            else {
                axis.minimum = chartAxisInfo.min;
            }
        }
        if (chartAxisInfo?.max) {
            if (typeof chartAxisInfo.max === "string") {
                axis.maximum = chart.data.labels.indexOf(chartAxisInfo.max);
            }
            else {
                axis.maximum = chartAxisInfo.max;
            }
        }
        const label = chartAxisInfo?.title?.text;
        if (label) {
            axis.label = label;
        }
        if (chartAxisInfo?.type === "logarithmic") {
            axis.type = "log10";
        }
        return axis;
    };
    const generateAxes = (chart) => {
        const axes = {
            x: {
                ...generateAxisInfo(chart.options?.scales?.x, chart),
                valueLabels: chart.data.labels.slice(0)
            },
            y: {
                ...generateAxisInfo(chart.options?.scales?.y, chart),
                format: (value) => value.toLocaleString()
            }
        };
        return axes;
    };
    const whichDataStructure = (data) => {
        if (Array.isArray(data[0])) {
            return data.map((arr, x) => {
                let [low, high] = arr.sort();
                return { x, low, high };
            });
        }
        return data;
    };
    const scrubX = (data) => {
        const blackboard = JSON.parse(JSON.stringify(data));
        let labels = [];
        if (Array.isArray(data)) {
            // console.log("not grouped");
            // Not grouped
            blackboard.forEach((item, x) => {
                if (typeof item === "object" && "x" in item) {
                    labels.push(item.x);
                    item.x = x;
                }
            });
            return { labels, data: blackboard };
        }
    };
    const processData = (data, c2m_types) => {
        if (c2m_types === "box") {
            return processBoxData(data);
        }
        let groups = [];
        if (data.datasets.length === 1) {
            return {
                data: whichDataStructure(data.datasets[0].data)
            };
        }
        const result = {};
        data.datasets.forEach((obj, index) => {
            const groupName = obj.label ?? `Group ${index + 1}`;
            groups.push(groupName);
            result[groupName] = whichDataStructure(obj.data);
        });
        return { groups, data: result };
    };
    const determineChartTitle = (options) => {
        if (options.plugins?.title?.text) {
            if (Array.isArray(options.plugins.title.text)) {
                return options.plugins.title.text.join(", ");
            }
            return options.plugins.title.text;
        }
        return "";
    };
    const determineCCElement = (canvas, provided) => {
        if (provided) {
            return provided;
        }
        const cc = document.createElement("div");
        canvas.insertAdjacentElement("afterend", cc);
        return cc;
    };
    const displayPoint = (chart) => {
        if (!chartStates.has(chart)) {
            return;
        }
        const { c2m: ref, visible_groups } = chartStates.get(chart);
        const { point, index } = ref.getCurrent();
        try {
            const highlightElements = [];
            if ("custom" in point) {
                highlightElements.push({
                    // @ts-ignore
                    datasetIndex: point.custom.group,
                    // @ts-ignore
                    index: point.custom.index
                });
            }
            else {
                visible_groups.forEach((datasetIndex) => {
                    highlightElements.push({
                        datasetIndex,
                        index
                    });
                });
            }
            chart?.setActiveElements(highlightElements);
            chart?.tooltip?.setActiveElements(highlightElements, {});
            chart?.update();
        }
        catch (e) {
            // console.warn(e);
        }
    };
    const generateChart = (chart, options) => {
        const { valid, c2m_types, invalidType } = processChartType(chart);
        if (!valid) {
            // @ts-ignore
            options.errorCallback?.(`Unable to connect chart2music to chart. The chart is of type "${invalidType}", which is not one of the supported chart types for this plugin. This plugin supports: ${Object.keys(chartjs_c2m_converter).join(", ")}`);
            return;
        }
        let axes = generateAxes(chart);
        if (chart.config.type === "wordCloud") {
            delete axes.x.minimum;
            delete axes.x.maximum;
            delete axes.y.minimum;
            delete axes.y.maximum;
            if (!axes.x.label) {
                axes.x.label = "Word";
            }
            if (!axes.y.label) {
                axes.y.label = "Emphasis";
            }
        }
        // Generate CC element
        const cc = determineCCElement(chart.canvas, options.cc);
        const { data, groups } = processData(chart.data, c2m_types);
        // lastDataObj = JSON.stringify(data);
        let scrub = scrubX(data);
        if (scrub?.labels && scrub?.labels?.length > 0) { // Something was scrubbed
            if (!chart.data.labels || chart.data.labels.length === 0) {
                axes.x.valueLabels = scrub.labels.slice(0);
            }
        }
        if (c2m_types === "scatter") {
            delete scrub?.data;
            delete axes.x.valueLabels;
        }
        axes = {
            ...axes,
            x: {
                ...axes.x,
                ...(options.axes?.x)
            },
            y: {
                ...axes.y,
                ...(options.axes?.y)
            },
        };
        const c2mOptions = {
            cc,
            element: chart.canvas,
            type: c2m_types,
            data: scrub?.data ?? data,
            title: determineChartTitle(chart.options),
            axes,
            options: {
                // @ts-ignore
                onFocusCallback: () => {
                    displayPoint(chart);
                }
            }
        };
        if (Array.isArray(c2mOptions.data)) {
            if (isNaN(c2mOptions.data[0])) {
                c2mOptions.data = c2mOptions.data.map((point, index) => {
                    return {
                        ...point,
                        custom: {
                            group: 0,
                            index
                        }
                    };
                });
            }
            else {
                c2mOptions.data = c2mOptions.data.map((num, index) => {
                    return {
                        x: index,
                        y: num,
                        custom: {
                            group: 0,
                            index
                        }
                    };
                });
            }
        }
        else {
            const groups = Object.keys(c2mOptions.data);
            groups.forEach((groupName, groupNumber) => {
                if (!isNaN(c2mOptions.data[groupName][0])) {
                    c2mOptions.data[groupName] = c2mOptions.data[groupName].map((num, index) => {
                        return {
                            x: index,
                            y: num,
                            custom: {
                                group: groupNumber,
                                index
                            }
                        };
                    });
                }
                else {
                    c2mOptions.data[groupName] = c2mOptions.data[groupName].map((point, index) => {
                        return {
                            ...point,
                            custom: {
                                group: groupNumber,
                                index
                            }
                        };
                    });
                }
            });
        }
        // @ts-ignore
        if (chart.config.options?.scales?.x?.stacked) {
            // @ts-ignore
            c2mOptions.options.stack = true;
        }
        // @ts-ignore
        if (options.audioEngine) {
            // @ts-ignore
            c2mOptions.audioEngine = options.audioEngine;
        }
        if (c2mOptions.data.length === 0) {
            return;
        }
        const { err, data: c2m } = c2mChart(c2mOptions);
        /* istanbul-ignore-next */
        if (err) {
            // @ts-ignore
            options.errorCallback?.(err);
            return;
        }
        if (!c2m) {
            return;
        }
        chartStates.set(chart, {
            c2m,
            visible_groups: groups?.map((g, i) => i) ?? []
        });
    };
    const plugin = {
        id: "chartjs2music",
        afterInit: (chart, args, options) => {
            if (!chartStates.has(chart)) {
                generateChart(chart, options);
                // Remove tooltip when the chart blurs
                chart.canvas.addEventListener("blur", () => {
                    chart.setActiveElements([]);
                    chart.tooltip?.setActiveElements([], {});
                    try {
                        chart.update();
                    }
                    catch (e) {
                        // console.warn(e);
                    }
                });
                // Show tooltip when the chart receives focus
                chart.canvas.addEventListener("focus", () => {
                    displayPoint(chart);
                });
            }
        },
        afterDatasetUpdate: (chart, args, options) => {
            if (!args.mode) {
                return;
            }
            if (!chartStates.has(chart)) {
                generateChart(chart, options);
            }
            const { c2m: ref, visible_groups } = chartStates.get(chart);
            if (!ref) {
                return;
            }
            // @ts-ignore
            const groups = ref._groups.slice(0);
            // @ts-ignore
            if (ref._options.stack) {
                groups.shift();
            }
            if (args.mode === "hide") {
                const err = ref.setCategoryVisibility(groups[args.index], false);
                visible_groups.splice(args.index, 1);
                if (err) {
                    console.error(err);
                }
                return;
            }
            if (args.mode === "show") {
                const err = ref.setCategoryVisibility(groups[args.index], true);
                visible_groups.push(args.index);
                if (err) {
                    console.error(err);
                }
                return;
            }
        },
        defaults: {
            cc: null,
            audioEngine: null,
            errorCallback: null
        }
    };

    return plugin;

})(c2mChart);
