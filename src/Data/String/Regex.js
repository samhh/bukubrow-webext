exports.matchAllFirstGroupsImpl = regex => str => [...str.matchAll(regex)]
    .map(x => x[1])
    .filter(x => typeof x === 'string');

