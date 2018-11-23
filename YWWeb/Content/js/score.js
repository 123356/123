var unitId = $.cookie("unitId")

$(function () {

    console.log(unitId + "...")
    setInterval(function () {
        setHeight()
    }, 100)
    //getScore()
})
function setHeight() {
    var h = $(window).height();
    var w = $(window).width()
    var headerH = $(".header").height()
    $(".main").height(h - headerH - 1)
    $(".left").height(h - headerH - 1)
    $(".left").width((w * 0.8) + 24)
    $(".right").height(h - headerH - 1)
}
function reCheck() {
    console.log("重新刷新")
    window.location.reload()
}

var vm = new Vue({
    el: '#scoreModel',
    data: {
        score: 0,
        checkCon: '--',
        refresh: true,
        list: [],
        checkState: '检测中...',
        unitId:0
    },
    methods: {

        getScore: function () {

            var that = this
            this.$http({
                url: '/Home/GetScoreByUID',
                method: 'post',
                params: {
                    uid: this.unitId
                }
            })
            .then(function (res) {
                console.log(res.data[0])
                var data = res.data
                var options = new Array()
                var relScore = 0

                for (var i = 0; i < data.length; i++) {
                    var score = 0
                    var okCount = 0
                    var check = 0
                    for (var j = 0; j < data[i].Ldata.length; j++) {
                        relScore += data[i].Ldata[j].Score
                        score += data[i].Ldata[j].Score
                        options.push(data[i].Ldata[j].Name)
                        if (data[i].Ldata[j].Score == data[i].Ldata[j].Fullmarks) {
                            okCount += 1
                        }
                        if (data[i].Ldata[i].isHave) {
                            check += 1
                        }
                    }
                    data[i].relScore = score
                    data[i].logoSrc = "/Content/images/score/score" + data[i].key + ".png"
                    data[i].okCount = okCount
                    data[i].optionCount = data[i].Ldata.length
                    data[i].check = check
                    data[i].childShow = true
                }
                //总实际分数

                that.score = relScore
                var ldataINdex = 0
                that.list = data

                var timer = setInterval(function () {
                    that.checkCon = "正在检测：" + options[ldataINdex]
                    if (ldataINdex == options.length - 1) {
                        that.checkCon = "检测完毕"
                        that.refresh = false
                        that.checkState = "检测完成"
                        for (var i = 0; i < that.list; i++) {
                            that.list[i].childShow = true
                        }
                        clearInterval(timer)
                    }
                    ldataINdex++
                }, 100)

            })
            .catch(function (e) {
                console.log(e)
            })
        },


    },
    beforeMount: function () {
        this.unitId = $.cookie("unitId")
        this.getScore()
    }
})