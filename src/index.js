var assets = require("@nathanfaucett/assets"),
    arrayMap = require("@nathanfaucett/array-map"),
    keys = require("@nathanfaucett/keys"),
    template = require("@nathanfaucett/template"),
    pushUnique = require("@nathanfaucett/push_unique"),
    chunks = require("./chunks");


var TextAsset = assets.TextAsset,
    TextAssetPrototype = TextAsset.prototype,

    VERTEX = "vertex",
    FRAGMENT = "fragment",

    chunkRegExps = arrayMap(keys(chunks), function(key) {
        return {
            key: key,
            regexp: new RegExp("\\b" + key + "\\b")
        };
    }),

    ShaderPrototype;


module.exports = Shader;


function Shader() {

    TextAsset.call(this);

    this.vertex = null;
    this.fragment = null;
    this.templateVariables = [];
}
TextAsset.extend(Shader, "shader.Shader");
ShaderPrototype = Shader.prototype;

ShaderPrototype.construct = function(options) {

    TextAssetPrototype.construct.call(this, options);

    options = options || {};

    if (options.vertex && options.fragment) {
        this.set(options.vertex, options.fragment);
    }

    return this;
};

ShaderPrototype.destructor = function() {

    TextAssetPrototype.destructor.call(this);

    this.vertex = null;
    this.fragment = null;
    this.templateVariables.length = 0;

    return this;
};

ShaderPrototype.parse = function(data) {
    if (data && data.vertex && data.fragment) {
        this.set(data.vertex, data.fragment);
    }
    return data;
};

ShaderPrototype.set = function(vertex, fragment) {

    this.templateVariables.length = 0;
    this.vertex = Shader_compile(this, vertex, VERTEX);
    this.fragment = Shader_compile(this, fragment, FRAGMENT);

    return this;
};

ShaderPrototype.toJSON = function(json) {

    json = TextAssetPrototype.toJSON.call(this, json);

    json.vertex = this.vertex;
    json.fragment = this.fragment;

    return json;
};

ShaderPrototype.fromJSON = function(json) {

    TextAssetPrototype.fromJSON.call(this, json);

    this.templateVariables.length = 0;
    this.set(json.vertex, json.fragment);

    return this;
};

function Shader_compile(_this, shader, type) {
    var templateVariables = _this.templateVariables,
        shaderChunks = [],
        out = "",
        i = -1,
        il = chunkRegExps.length - 1,
        chunkRegExp;

    while (i++ < il) {
        chunkRegExp = chunkRegExps[i];

        if (chunkRegExp.regexp.test(shader)) {
            requireChunk(shaderChunks, templateVariables, chunks[chunkRegExp.key], type);
        }
    }

    i = -1;
    il = shaderChunks.length - 1;
    while (i++ < il) {
        out += shaderChunks[i].code;
    }

    return template(out + "\n" + shader);
}

function requireChunk(shaderChunks, templateVariables, chunk, type) {
    var requires, i, il;

    if (
        type === VERTEX && chunk.vertex ||
        type === FRAGMENT && chunk.fragment
    ) {
        requires = chunk.requires;
        i = -1;
        il = requires.length - 1;

        while (i++ < il) {
            requireChunk(shaderChunks, templateVariables, chunks[requires[i]], type);
        }

        pushUnique(shaderChunks, chunk);

        if (chunk.template) {
            pushUnique.array(templateVariables, chunk.template);
        }
    }
}