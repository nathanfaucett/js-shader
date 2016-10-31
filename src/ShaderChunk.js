var isArray = require("@nathanfaucett/is_array"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined");


var ShaderChunkPrototype;


module.exports = ShaderChunk;


function ShaderChunk() {
    this.code = null;
    this.template = null;
    this.vertex = null;
    this.fragment = null;
    this.requires = null;
    this.extensions = null;
}
ShaderChunkPrototype = ShaderChunk.prototype;

ShaderChunk.create = function(options) {
    return (new ShaderChunk()).construct(options);
};

ShaderChunkPrototype.construct = function(options) {

    options = options || {};

    this.code = options.code;
    this.template = options.template;
    this.vertex = isNullOrUndefined(options.vertex) ? true : !!options.vertex;
    this.fragment = isNullOrUndefined(options.fragment) ? true : !!options.fragment;
    this.requires = isArray(options.requires) ? options.requires : [];
    this.extensions = isArray(options.extensions) ? options.extensions : [];

    return this;
};

ShaderChunkPrototype.destructor = function() {

    this.code = null;
    this.template = null;
    this.vertex = null;
    this.fragment = null;
    this.requires = null;
    this.extensions = null;

    return this;
};