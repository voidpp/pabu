
const durationDesc = [
    {divider: 3600, unit: 'hour'},
    {divider: 60, unit: 'minute'},
    {divider: 1, unit: 'second'},
];

export function formatDuration(value: number): string {

    let isNeg = value < 0;

    if (isNeg)
        value = -value;

    let resValue = 0;
    let resUnit = 'second';

    for (let d of durationDesc) {
        let dv = value / d.divider;
        if (dv >= 1) {
            resValue = dv;
            resUnit = d.unit;
            break;
        }
    }

    return `${(isNeg ? -resValue : resValue).toFixed(1)} ${resUnit}` + (resValue > 1 ? 's' : '');
}

export function formatStopwatchDuration(value: number): string {
    const hours = Math.floor(value/3600);
    const minutes = Math.floor(value % 3600 / 60);
    const seconds = Math.floor(value % 60);

    const num = (v: number) => v.toString().padStart(2, '0')

    return `${num(hours)}:${num(minutes)}:${num(seconds)}`
}
