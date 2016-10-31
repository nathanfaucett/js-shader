var tape = require("tape"),
    Shader = require("..");


tape("shader", function(assert) {
    var shader = Shader.create("shader", "", "void main() {}", "void main() {}");

    assert.equal(shader.vertex(), "\nvoid main() {}");
    assert.equal(shader.fragment(), "\nvoid main() {}");

    assert.end();
});