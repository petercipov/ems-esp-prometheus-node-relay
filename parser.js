module.exports = {
    parse: function(tags, body) {
        if (tags.length >0) {
            const lastTag = tags[tags.length - 1];
            if (!isNaN(body)) {
                return {
                    [lastTag]: Number(body)
                }
            } else if ((typeof body === 'string')) {
                try {
                    return JSON.parse(body);
                } catch (ex) {
                    return {
                        [lastTag]: body
                    } 
                }
            }
        }
        return {}
    }
};