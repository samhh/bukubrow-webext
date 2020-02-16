exports.mkUrlImpl = (x) => {
    try {
        return new URL(x);
    } catch (_) {
        return null;
    }
};

