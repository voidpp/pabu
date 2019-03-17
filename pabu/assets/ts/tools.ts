
const durationDesc = [
    {divider: 3600, unit: 'hour'},
    {divider: 60, unit: 'minute'},
    {divider: 1, unit: 'second'},
];

export function formatDuration(value: number): string {

    let resValue = 0;
    let resUnit = 'second';

    for (let d of durationDesc) {
        let dv = value / d.divider;
        if (dv > 1) {
            resValue = dv;
            resUnit = d.unit;
            break;
        }
    }

    return `${resValue.toFixed(1)} ${resUnit}` + (resValue > 1 ? 's' : '');
}
