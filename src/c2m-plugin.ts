import type { ChartOptions, Plugin, Chart } from "chart.js";
import c2mChart from "chart2music";

let c2mChartRef: any = null;
// let lastDataObj = "";

const chartjs_c2m_converter: any = {
    bar: "bar",
    line: "line",
    pie: "pie",
    polarArea: "bar",
    doughnut: "pie"
};

const processChartType = (chart: any) => {
    const topLevelType = chart.config.type;

    const panelTypes = chart.data.datasets.map(({type}: any) => type ?? topLevelType);

    const invalid = panelTypes.find((t: string) => !(t in chartjs_c2m_converter));
    if(invalid){
        return {
            valid: false,
            invalidType: invalid
        }
    }

    if([...new Set(panelTypes)].length === 1){
        return {
            valid: true,
            c2m_types: chartjs_c2m_converter[panelTypes[0] as keyof typeof chartjs_c2m_converter]
        };
    }

    return {
        valid: true,
        c2m_types: panelTypes.map((t: string) => chartjs_c2m_converter[t])
    }
}

const generateAxisInfo = (chartAxisInfo: any, chart: any) => {
    const axis = {} as any;
    if(chartAxisInfo?.min){
        if(typeof chartAxisInfo.min === "string"){
            axis.minimum = chart.data.labels.indexOf(chartAxisInfo.min);
        }else{
            axis.minimum = chartAxisInfo.min;
        }
    }
    if(chartAxisInfo?.max){
        if(typeof chartAxisInfo.max === "string"){
            axis.maximum = chart.data.labels.indexOf(chartAxisInfo.max);
        }else{
            axis.maximum = chartAxisInfo.max;
        }
    }
    const label = chartAxisInfo?.title?.text;
    if(label){
        axis.label = label;
    }

    if(chartAxisInfo?.type === "logarithmic"){
        axis.type = "log10";
    }

    return axis;
}

const generateAxes = (chart: any) => {
    const axes = {
        x: {
            ...generateAxisInfo(chart.options?.scales?.x, chart),
            valueLabels: chart.data.labels.slice(0)
        },
        y: {
            ...generateAxisInfo(chart.options?.scales?.y, chart),
            format: (value: number) => value.toLocaleString()
        }
    };

    return axes;
}

const whichDataStructure = (data: any[]) => {
    if(Array.isArray(data[0])){
        return data.map((arr: any, x: number) => {
            let [low, high] = arr.sort()
            return {x, low, high};
        });
    }
    return data;
}

const scrubX = (data: any) => {
    const blackboard = JSON.parse(JSON.stringify(data));

    let labels: string[] = [];
    if(Array.isArray(data)){
        // console.log("not grouped");
        // Not grouped
        blackboard.forEach((item, x) => {
            if(typeof item === "object" && "x" in item){
                labels.push(item.x);
                item.x = x;
            }
        });
        return {labels, data: blackboard};

    }else{
        // Grouped

    }
}

const processData = (data: any) => {
    let groups: string[] = [];

    if(data.datasets.length === 1){
        return {
            data: whichDataStructure(data.datasets[0].data)
        }
    }

    const result = {} as Record<string, any>;

    data.datasets.forEach((obj: any, index: number) => {
        const groupName = obj.label ?? `Group ${index+1}`;
        groups.push(groupName);
        
        result[groupName] = whichDataStructure(obj.data);
    });

    return {groups, data: result};
}

const determineChartTitle = (options: ChartOptions) => {
    if(options.plugins?.title?.text){
        if(Array.isArray(options.plugins.title.text)){
            return options.plugins.title.text.join(", ");
        }
        return options.plugins.title.text;
    }
    return "";
}

const determineCCElement = (canvas: HTMLCanvasElement, provided: HTMLElement | null) => {
    if(provided){
        return provided;
    }

    const cc = document.createElement("div");
    canvas.insertAdjacentElement("afterend", cc);
    return cc;
}

export const plugin: Plugin = {
    id: "chartjs2music",

    afterInit: (chart: Chart, args, options) => {
        const {valid, c2m_types, invalidType} = processChartType(chart);

        if(!valid){
            options.errorCallback?.(`Unable to connect chart2music to chart. The chart is of type "${invalidType}", which is not one of the supported chart types for this plugin. This plugin supports: ${Object.keys(chartjs_c2m_converter).join(", ")}`);
            return;
        }

        const axes = generateAxes(chart);

        // Generate CC element
        const cc = determineCCElement(chart.canvas, options.cc);

        const {data, groups} = processData(chart.data);
        // lastDataObj = JSON.stringify(data);

        let scrub = scrubX(data);
        if(scrub?.labels && scrub?.labels?.length > 0){   // Something was scrubbed
            if(!chart.data.labels || chart.data.labels.length === 0){
                axes.x.valueLabels = scrub.labels.slice(0);
            }    
        }

        const c2mOptions = {
            cc,
            element: chart.canvas,
            type: c2m_types,
            data: scrub?.data ?? data,
            title: determineChartTitle(chart.options),
            axes,
            options: {
                // @ts-ignore
                onFocusCallback: ({slice, index}) => {
                    try{
                        const highlightElements = [{
                            datasetIndex: groups?.indexOf(slice) ?? 0,
                            index
                        }];
                        chart?.setActiveElements(highlightElements);
                        chart?.tooltip?.setActiveElements(highlightElements, {})
                        chart?.update();
                    }catch(e){
                        // console.warn(e);
                    }
                }
            }
        };

        if(options.audioEngine){
            // @ts-ignore
            c2mOptions.audioEngine = options.audioEngine;
        }

        const {err, data:c2m} = c2mChart(c2mOptions);
        c2mChartRef = c2m;

        // /* istanbul-ignore-next */
        if(err){
            options.errorCallback?.(err);
        }
    },

    // afterUpdate: (chart: Chart) => {
    //     const {data} = processData(chart.data);
    //     if(JSON.stringify(data) !== lastDataObj){
    //         c2mChartRef?.setData(data);
    //         lastDataObj = JSON.stringify(data);
    //     }

    // },

    defaults: {
        cc: null,
        audioEngine: null,
        errorCallback: null
    }

};