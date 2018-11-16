// JavaScript Document
//千一网络 www.cftea.com
//CProgress v1.0.0.1
//修正 IE 中 progressHeight 过大时与实际值偏差的问题


//进度条控件类

function CProgress(progress_Str, min, max, pos)
{
    this.progress_Str = progress_Str;
    this.progressId = document.getElementById(this.progress_Str);
    this.barIdStr = progress_Str + "_bar";
    this.barId = null;
    
    this.min = (min>=0)?min:0;
    this.max = (max>=min)?max:min;
    this.pos = (pos>=min && pos<=max)?pos:min;
    this.step = 1;
    
    this.progressWidth = 100;
    this.progressHeight = 15;
    this.progressBorderClr = "#000000";
    this.progressBarClr = "#006699";
    
    this.Create = CProgress_Create;

    this.SetStep = CProgress_SetStep;
    this.SetPos = CProgress_SetPos;
    this.Inc = CProgress_Inc;
    this.Desc = CProgress_Desc;
	this.GetPos = CProgress_GetPos;
	
}


//创建进度条控件
function CProgress_Create()
{
    if (document.all)
    {
        this.progressId.style.width = (this.progressWidth+2) + "px"; //IE 的边框属于宽度的一部分
        this.progressId.style.height = (this.progressHeight+2) + "px";
    }
    else
    {
        this.progressId.style.width = this.progressWidth + "px";
        this.progressId.style.height = this.progressHeight + "px";
    }
    //this.progressId.style.fontSize = this.progressHeight + "px"; //v1.0.0.1 修正
    this.progressId.style.fontSize = "0px";
    this.progressId.style.border = "1px solid " + this.progressBorderClr;
    this.progressId.innerHTML = "<div id=\"" + this.barIdStr + "\" style=\"width:0px;height:100%;background-color:" + this.progressBarClr + ";\"></div>";
    this.barId = document.getElementById(this.barIdStr);
    this.SetPos(this.pos);
}


//设置进度条的步长
function CProgress_SetStep(step)
{
    this.step = step;
}

function CProgress_GetPos()
{
	return this.pos;
}

//设置进度条的当前指示位置
function CProgress_SetPos(pos)
{
    pos = (pos<=this.max)?pos:this.max;
    pos = (pos>=this.min)?pos:this.min;
    this.pos = pos;
    this.barId.style.width = (this.progressWidth*this.pos)/this.max + "px";
}


//进度条"前进"
function CProgress_Inc()
{
    this.SetPos(this.pos+this.step);
}


//进度条"后退"
function CProgress_Desc()
{
    this.SetPos(this.pos-this.step);
}