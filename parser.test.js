const PARSER = require('./parser');

test('empty imput will be parse to empty output', () => {
    const result = PARSER.parse([], "")
    expect(result).toBeDefined();
    expect(result).toEqual({});
});

test('if no tags return empty output', () => {
    const result = PARSER.parse([], "abcd")
    expect(result).toBeDefined();
    expect(result).toEqual({});
});

test('if tag present and value is string return object with string', () => {
    const result = PARSER.parse(["tag1"], "abcd");
    expect(result).toBeDefined();
    expect(result).toEqual({
        tag1: "abcd"
    });
});

test('if tags present and value is string return object with string and last tag as key', () => {
    const result = PARSER.parse(["tag1", "tag2"], "abcd");
    expect(result).toBeDefined();
    expect(result).toEqual({
        tag2: "abcd"
    });
});


test('if tags present and value is integer return object with integer and last tag as key', () => {
    const result = PARSER.parse(["tag1", "tag2"], "55");
    expect(result).toBeDefined();
    expect(result).toEqual({
        tag2: 55
    });
});

test('if tags present and value is float return object with float and last tag as key', () => {
    const result = PARSER.parse(["tag1", "tag2"], "55.999");
    expect(result).toBeDefined();
    expect(result).toEqual({
        tag2: 55.999
    });
});


test('if tags present and value is json return object with parsed json', () => {
    const result = PARSER.parse(["tag1", "tag2"], "{\"parsed\":\"json\"}");
    expect(result).toBeDefined();
    expect(result).toEqual({
        parsed: "json"
    });
});
