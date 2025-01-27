const thirtyDaysFromNow = () => Date(Date.now() * 30 * 24 * 60 * 60 * 1000);

const fiftenMinutresFromNow = () => Date(Date.now() * 15 * 60 * 1000);
module.exports = { thirtyDaysFromNow, fiftenMinutresFromNow }