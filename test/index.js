var tape = require("tape"),
    Shader = require("..");


tape("shader", function(assert) {
    var shader = Shader.create({
        name: "shader",
        src: null,
        vertex: "void main() {}",
        fragment: "void main() {}"
    });

    assert.equal(shader.vertex(), "\nvoid main() {}");
    assert.equal(shader.fragment(), "\nvoid main() {}");

    assert.end();
});