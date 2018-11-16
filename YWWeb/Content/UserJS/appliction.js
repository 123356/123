function RepeatLogin() {
    $.post("/Home/IsLogin", function (data) {
        if (data == "true") {
            window.location.href="/Home/Login"
        }
    })
}
$(function () {
    RepeatLogin();
    setInterval(RepeatLogin, 60000);
})