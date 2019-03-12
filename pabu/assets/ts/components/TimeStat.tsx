import * as React from 'react';

import { TimeSummary } from '../types';

type Props = {
    stat: TimeSummary,
}

export default React.memo((props: Props) => {
    let {spent, paid, ongoing} = props.stat;
    return <span>{(spent/3600).toFixed(1)} hours</span>
});
