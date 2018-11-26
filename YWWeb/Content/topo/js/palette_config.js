var palette_config = {
    scene: {
        name: '电力',
        items: [{
            name: '文字',
            type: "text.png",
            canvas: "text"
        }, {
            name: '刀闸',
            type: "breaker.png",
            canvas: `g.strokeStyle=node.color;g.lineWidth=3;g.beginPath();g.moveTo(-node.width/2,-node.height/2);g.lineTo(0,node.height/2);g.lineTo(node.width/2,-node.height/2);g.stroke();this.paintText(g);`
}, {
    name: '箭头',
    type: "arrow.png",
    canvas: "g.beginPath();g.fillStyle=node.color;g.lineWidth=2;g.moveTo(-node.width/2,-node.height/2);g.lineTo(0,node.height/2);g.lineTo(node.width/2,-node.height/2);g.closePath();g.fill();this.paintText(g);"
}, {
name: '开关',
    type: "switch.png",
canvas: "g.beginPath();g.fillStyle=node.color;g.fillRect(-node.width/2,-node.height/2,node.width,node.height);this.paintText(g);"
}, {
    name: '接地',
    type: "ground.png",
    canvas: "g.beginPath();g.lineWidth=3;g.strokeStyle=node.color;g.moveTo(0,-node.height/2);g.lineTo(0,0);g.moveTo(0,-node.height/2);g.lineTo(0,0);g.moveTo(-node.width/2,0);g.lineTo(node.width/2,0);g.moveTo(-node.width/3,node.height/4);g.lineTo(node.width/3,node.height/4);g.moveTo(-node.width/4,node.height/2);g.lineTo(node.width/4,node.height/2);g.stroke();this.paintText(g);"
}, {
name: '一对刀闸',
    type: "doubleBreaker.png",
canvas: `g.beginPath(); g.lineWidth = 2; g.strokeStyle = node.color; g.moveTo(node.width / 2, 0); g.lineTo(0, -node.height / 2); g.lineTo(-node.width / 2, 0); g.moveTo(node.width / 2, node.height / 2); g.lineTo(0, 0); g.lineTo(-node.width / 2, node.height / 2); g.stroke(); this.paintText(g);`
}, {
    name: '9',
    type: "9.png",
    canvas: "g.beginPath();g.lineWidth = 2;g.strokeStyle=node.color;g.strokeRect(-node.width/2,-node.height/2,node.width,node.height);g.stroke();this.paintText(g);"
}, {
name: '10',
    type: "10.png",
canvas: `g.strokeStyle=node.color;g.lineWidth=2;g.beginPath();g.fillStyle="rgba(255,255,0,"+this.alpha+")";g.arc(0,0,node.width/2,node.beginDegree,node.beginDegree+2*Math.PI);g.stroke();g.closePath();g.lineWidth=3;g.beginPath();g.moveTo(node.width/3,-node.height/3);g.lineTo(0,node.height/2);g.lineTo(-node.width/3,-node.height/3);g.stroke();g.closePath();this.paintText(g); this.paintText(g);`
}, {
    name: '电表',
    type: "electricMeter.png",
    canvas: `var img=new Image();img.src="../../Content/topo/img/symbols/electricMeter.png";g.drawImage(img,-node.width/2,-node.height/2,node.width,node.height);this.paintText(g);`
}, {
name: '12',
    type: "12.png",
canvas: `g.beginPath();g.strokeStyle="#f00";g.arc(0,-node.height/4,node.height/4,0,2*Math.PI,true);g.lineWidth=2;g.stroke();g.beginPath();g.arc(0,node.height/4,node.height/4,0,2*Math.PI,true);g.moveTo(0,-node.height/5*2);g.lineTo(-node.width/8,-node.height/6);g.lineTo(node.width/8,-node.height/6);g.lineTo(0,-node.height/5*2);g.moveTo(node.width/8,node.height/9);g.lineTo(0,node.height/4);g.lineTo(-node.width/8,node.height/9);g.moveTo(0,node.height/4);g.lineTo(0,node.height/5*2);g.stroke();`
},
{
    name: '13',
    type: "13.png",
    canvas: `g.beginPath();g.strokeStyle="#f00";g.lineWidth=3;g.strokeRect(-node.width/3,-node.height/6,node.width/2,node.height/3);g.moveTo(-node.width/2,0);g.lineTo(-node.width/3,0);g.moveTo(node.width/6,0);g.lineTo(node.width/3,0);g.lineTo(node.width/3,node.height/7);g.lineTo(node.width/2,0);g.lineTo(node.width/3,-node.height/7);g.lineTo(node.width/3,0);g.stroke();this.paintText(g);`
}, {
name: '13实心',
    type: "13s.png",
canvas: `g.beginPath();g.strokeStyle="#f00";g.lineWidth=3;g.strokeRect(-node.width/3,-node.height/6,node.width/2,node.height/3);g.moveTo(-node.width/2,0);g.lineTo(-node.width/3,0);g.stroke();g.closePath();g.beginPath();g.moveTo(node.width/6,0);g.lineTo(node.width/3,0);g.stroke();g.closePath();g.beginPath();g.moveTo(node.width/3,0);g.lineTo(node.width/3,node.height/7);g.lineTo(node.width/2,0);g.lineTo(node.width/3,-node.height/7);g.lineTo(node.width/3,0);g.fillStyle="#f00";g.fill();this.paintText(g);`
},
{
    name: '13全部实心',
    type: "13ss.png",
    canvas: `g.beginPath();g.strokeStyle=node.color;g.fillStyle=node.color;g.lineWidth=3;g.fillRect(-node.width/3,-node.height/6,node.width/2,node.height/3);g.fill();g.closePath();g.beginPath();g.moveTo(-node.width/2,0);g.lineTo(-node.width/3,0);g.stroke();g.closePath();g.beginPath();g.moveTo(node.width/6,0);g.lineTo(node.width/3,0);g.stroke();g.closePath();g.beginPath();g.moveTo(node.width/3,0);g.lineTo(node.width/3,node.height/7);g.lineTo(node.width/2,0);g.lineTo(node.width/3,-node.height/7);g.lineTo(node.width/3,0);g.fillStyle=node.color;g.fill();this.paintText(g);`
}, {
name: '14',
    type: "14.png",
canvas: `var img=new Image();img.src="../../Content/topo/img/symbols/14.png";g.drawImage(img,-node.width/2,-node.height/2,node.width,node.height);this.paintText(g);`
},
]
},
};


var palette_MenuBar = [{
    url: "editSize.png",
    title: "编辑大小",
    name: "editSize"
}, {
    url: "line.png",
    title: "创建连线",
    name: "line"
}, {
    url: "switch.png",
    title: "切换编辑模式",
    name: "switch"
}, {
    url: "monospace.png",
    title: "等宽(鼠标进图画布生效)",
    name: "monospace"
}, {
    url: "contour.png",
    title: "等高(鼠标进图画布生效)",
    name: "contour"
}, {
    url: "sameWidth.png",
    title: "等大小(鼠标进图画布生效)",
    name: "sameWidth"
}, {
    url: "level.png",
    title: "水平对齐(鼠标进图画布生效)",
    name: "level"
}, {
    url: "vertical.png",
    title: "垂直对齐(鼠标进图画布生效)",
    name: "vertical"
}, {
    url: "horizontalSpacing.png",
    title: "水平等间距(鼠标进图画布生效)",
    name: "horizontalSpacing"
}, {
    url: "verticalSpacing.png",
    title: "垂直等间距(鼠标进图画布生效)",
    name: "verticalSpacing"
}, {
    url: "save.png",
    title: "保存",
    name: "save"
}];

var palette_Attributes = [{
    name: '父节点ID',
    type: "text",
    sort: "line node",
    title: "parentID"
}, {
    name: 'ID',
    type: "number",
    sort: "node text",
    title: "ID"
}, {
    name: '故障状态',
    type: "text",
    sort: "node",
    title: "failureState"
}, {
    name: 'DID',
    type: "select",
    sort: "node",
    title: "DID"
}, {
    name: 'CID',
    type: "select",
    sort: "node",
    title: "CID"
}, {
    name: '状态',
    type: "number",
    sort: "line node ",
    title: "statusvalue"
}, {
    name: '状态0',
    type: "color",
    sort: " line",
    title: "state0"
}, {
    name: '状态1',
    type: "color",
    sort: " line",
    title: "state1"
}, {
    name: '文字颜色',
    type: "color",
    sort: "text",
    title: "state4"
}, {
    name: '状态0',
    type: "color",
    sort: "node",
    title: "status0"
}, {
    name: '状态1',
    type: "color",
    sort: "node",
    title: "status1"
}, {
    name: '状态2',
    type: "color",
    sort: "node",
    title: "status2"
}, {
    name: 'x',
    type: "number",
    sort: "line node text",
    title: "x"
}, {
    name: 'y',
    type: "number",
    sort: "line node text",
    title: "y"
}, {
    name: '锁定',
    type: "checkbox",
    sort: "line node text",
    title: "fixe"
}, {
    name: '内容',
    type: "text",
    sort: "text",
    title: "content"
}, {
    name: '字体',
    type: "text",
    sort: "text",
    title: "font"
}, {
    name: '宽',
    type: "number",
    sort: "node",
    title: "width"
}, {
    name: '高',
    type: "number",
    sort: "node",
    title: "height"
}, {
    name: '间距',
    type: "number",
    sort: "node text",
    title: "spacing"
}, {
    name: '角度',
    type: "number",
    sort: "node text",
    title: "angle"
}, {
    name: '复制偏移',
    type: "number",
    sort: "node text line",
    title: "copyOffset"
}, {
    name: '线条宽度',
    type: "number",
    sort: "line",
    title: "linewidth"
}, {
    name: '线条长度',
    type: "number",
    sort: "line",
    title: "linelength"
}, {
    name: 'PID',
    type: "number",
    sort: "scene",
    title: "pid",
}, {
    name: '编号',
    type: "number",
    sort: "scene",
    title: "orderNo",
    value: '提交'
}, {
    name: '历史',
    type: "button",
    sort: "scene",
    title: "checkMap",
    value: "查看"
}, {
    name: '背景颜色',
    type: "color",
    sort: "scene",
    title: "bgcolor"
}, {
    name: '画布底图',
    type: "file",
    sort: "scene",
    title: "map"
}, {
    name: '删除底图',
    type: "button",
    sort: "scene",
    title: "deleteMap",
    value: "删除底图"
},
    {
        name: '图层',
        type: "number",
        sort: "node text line",
        title: "zIndex"
    }
]