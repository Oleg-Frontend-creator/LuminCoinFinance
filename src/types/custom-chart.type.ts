export type CustomChartType = {
    type: string,
    data: {
        labels: string[],
        datasets: [{
            data: number[],
            borderWidth: number
        }]
    },
    padding: string
}