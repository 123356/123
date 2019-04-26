var palette_config = {
    scene: {
        name: "通讯",
        items: [{
            name: "文字",
            type: "text",
            src: "text.png"
        }, {
            name: "服务器",
            type: "PID",
            src: "server.png"
        }, {
            name: "电表",
            type: "CID",
            src: "electric-meter.png"
        }, {
            name: "水表",
            type: "CID",
            src: "water-meter.png"
        }, {
            name: "气表",
            type: "CID",
            src: "gas-meter.png"
        }, {
            name: "交换机",
            type: "DID",
            src: "switches.png"
        }, ]
    },
};
var palette_MenuBar = [{
    url: "switch.png",
    title: "切换编辑模式",
    name: "switch"
}, {
    url: "save.png",
    title: "保存",
    name: "save"
}];
var palette_Attributes = [{
        name: "父节点ID",
        type: "text",
        sort: "line node",
        title: "parentID"
    },
    {
        name: "ID",
        type: "input",
        sort: "node",
        title: "ID"
    },
    {
        name: "类型",
        type: "input",
        sort: "node",
        title: "_userType"
    },
    {
        name: "路径",
        type: "input",
        sort: "node",
        title: "path"
    },
      {
            name: "名称",
            type: "type",
            sort: "node",
            title: "name"
        }, 
    {
        name: "文字颜色",
        type: "color",
        sort: "text",
        title: "state4"
    }, {
        name: "x",
        type: "number",
        sort: "line node text",
        title: "x"
    }, {
        name: "y",
        type: "number",
        sort: "line node text",
        title: "y"
    }, {
        name: "锁定",
        type: "checkbox",
        sort: "line node text",
        title: "fixe"
    }, {
        name: "内容",
        type: "text",
        sort: "text",
        title: "content"
    }, {
        name: "字体",
        type: "text",
        sort: "text",
        title: "font"
    }, {
        name: "宽",
        type: "number",
        sort: "node",
        title: "width"
    }, {
        name: "高",
        type: "number",
        sort: "node",
        title: "height"
    }, {
        name: "角度",
        type: "number",
        sort: "node text",
        title: "angle"
    }, {
        name: "复制偏移",
        type: "number",
        sort: "node text line",
        title: "copyOffset"
    }, {
        name: "线条宽度",
        type: "number",
        sort: "line",
        title: "linewidth"
    }, {
        name: "线条长度",
        type: "number",
        sort: "line",
        title: "linelength"
    }, {
        name: "PID",
        type: "number",
        sort: "scene",
        title: "pid",
    }, {
        name: "编号",
        type: "number",
        sort: "scene",
        title: "orderNo",
        value: "提交"
    }, 
    {
        name: "生成",
        type: "button",
        sort: "scene",
        title: "settopo",
        value: "确定"
    },
    {
        name: "历史",
        type: "button",
        sort: "scene",
        title: "checkMap",
        value: "查看"
    }, 
  
    {
        name: "背景颜色",
        type: "color",
        sort: "scene",
        title: "bgcolor"
    }, {
        name: "画布底图",
        type: "file",
        sort: "scene",
        title: "map"
    }, {
        name: "删除底图",
        type: "button",
        sort: "scene",
        title: "deleteMap",
        value: "删除底图"
    }, {
        name: "图层",
        type: "number",
        sort: "node text line",
        title: "zIndex"
    }, {
        name: "IP地址",
        type: "text",
        sort: "scene",
        title: "IP"
    }, {
        name: "端口号",
        type: "text",
        sort: "scene",
        title: "port"
    }, {
        name: "账号",
        type: "text",
        sort: "scene",
        title: "account"
    }, {
        name: "密码",
        type: "text",
        sort: "scene",
        title: "password"
    },
];
var palette_html = {
    alert1: "配电室ID和编号不能为空",
    alert2: "保存成功",
    qsrnr: "请输入内容",
    ztys: "16px 微软雅黑",
    shuxing: "属性",
    zhi: "值",
    qingsz: "请选择",
    llcg: "连接成功",
    dianliu: "电流",
    dianya: "电压"
};
