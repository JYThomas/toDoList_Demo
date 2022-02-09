/*
 * @Description: 
    ToDoList Logic 代码运行版，localStorage存储要函数解耦 再次体会到函数封装的重要性
 * @Author: MorantJY
 * @Date: 2022-02-07 14:00:24
 * @LastEditors: MorantJY
 * @LastEditTime: 2022-02-09 14:33:37
 */

var toDoArr = new Array(); //创建全局动态数组
var btn = document.getElementById("add");
var tbx = document.getElementById("input");
var toDo_Ol = document.querySelectorAll("ol")[0]; //获取代办列表
var finished_Ol = document.querySelectorAll("ol")[1]; //获取已完成列表
var cleanBtn = document.getElementById("cleanBtn"); 


// 创建列表结点
function createDataLi(_textVal){
    let node = document.createElement("li"); //创建li结点
    let finishedBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");

    let textNode_toDo = document.createTextNode(_textVal); //创建text结点
    let textNode_finished = document.createTextNode("finished");
    let textNode_del = document.createTextNode("delete");
    
    // 添加结点
    finishedBtn.appendChild(textNode_finished);
    deleteBtn.appendChild(textNode_del);

    // 设置样式
    finishedBtn.className = "finishedBtn";
    deleteBtn.className = "delBtn";

    // 添加结点到li
    node.appendChild(textNode_toDo);
    node.appendChild(deleteBtn);
    node.appendChild(finishedBtn);

    // 添加结点到ol
    toDo_Ol.appendChild(node);
}

// 创建已完成列表结点
function createFinishedLi(_finishedText){

    let node = document.createElement("li"); //创建li结点
    let textNode_finished = document.createTextNode(_finishedText); //创建text结点
    let delLine = document.createElement("del"); //删除线

    delLine.appendChild(textNode_finished); //删除线结点添加文字
    node.appendChild(delLine); //li结点添加删除线结点

    finished_Ol.appendChild(node); //ol添加li结点
}

// 添加待办
btn.onclick = function(){
    let tbxVal = tbx.value; 
    if(!tbxVal){
        alert("input toDo before add!");
    }
    else{
        pushObj(toDoArr,tbxVal);
        setData(toDoArr);
        removeLiBeforeRendering(toDo_Ol);
        removeLiBeforeRendering(finished_Ol);

        load();
        
        tbx.value = null;  //输入完毕文本框置空
    }
}

// 操作待办项 (使用事件委托减少DOM操作绑定事件)
toDo_Ol.onclick = function(event){
    let currentLi = event.target.parentNode;

    // 删除代办
    if(event.target.className=="delBtn"){
        let currentStr = returnCurrentLiTitle(currentLi);
        toDoArr = delTargetObj(currentStr); //返回删除后的对象数组
        setData(toDoArr);

        removeLiBeforeRendering(toDo_Ol);
        removeLiBeforeRendering(finished_Ol);
        load();
    }

    // 完成代办
    if(event.target.className=="finishedBtn"){
        let finishedText = returnCurrentLiTitle(currentLi);
        let localStr = getData();
        let localArrData = getArrData(localStr);

        toDoArr = updateState(localArrData,finishedText);
        setData(toDoArr);
        removeLiBeforeRendering(toDo_Ol);
        removeLiBeforeRendering(finished_Ol);

        load();
    }
}

// 清除已完成项目
cleanBtn.onclick = function(){
    let localStr = getData();
    let localData = getArrData(localStr);
    toDoArr = delFinished(localData);
    setData(toDoArr);

    removeLiBeforeRendering(toDo_Ol);
    removeLiBeforeRendering(finished_Ol);
    load();
}





/*======================== function Area =====================*/ 

// 新增项push进对象数组
function pushObj(_toDoArr,_tbxVal){
    let obj = {
        title : _tbxVal,
        done : false
    }
    _toDoArr.push(obj);
}

//数据存入localStorage
function setData(_toDoArr){
    /*
        只添加一组key-value实现localStorage数据存储覆盖问题
        而不是使用多组key-value
    */
    localStorage.setItem("todo",JSON.stringify(_toDoArr)); 
}

//获取localStorage字符串数据并返回
function getData(){
    return localStorage.getItem("todo");
}

// 将localStorage数据转为对象数组(string转对象数组)
function getArrData(_localStr){
    return JSON.parse(_localStr);
}

//返回选中的li待办事项tittle
function returnCurrentLiTitle(_currentLi){
    let str = _currentLi.innerHTML;
    return filter(str);
}

//输入要删除的待办项内容，返回删除之后的数据数组
function delTargetObj(_currentStr){
    let localStr = getData();
    let toDoArrItems = getArrData(localStr); //旧的数组项
    let newToDoArrItems = new Array(); //新的数组项
    if(toDoArrItems){
        for(let i=0;i<toDoArrItems.length;i++){
            if(toDoArrItems[i].title != _currentStr){
                newToDoArrItems.push(toDoArrItems[i]);
            }
        }
    }
    return newToDoArrItems;
}

function updateState(_localArrData,_finishedText){
    let newArrData = new Array();
    if(_localArrData){
        for(let i=0;i<_localArrData.length;i++){
            if(_localArrData[i].title == _finishedText){
                _localArrData[i].done = true;
            }
            newArrData.push(_localArrData[i]);
        }
    }
    return newArrData;
}

/*
    删除已完成项目(拿出所有还未完成的数据放到本地就是删除了已完成)
    返回状态为false的数据
*/
function delFinished(_localData){
    let newArrData = new Array();
    if(_localData){
        for(let i=0;i<_localData.length;i++){
            if(_localData[i].done == false){
                newArrData.push(_localData[i]);
            }
        }
    }
    return newArrData;
}



// 过滤li的文字,过滤返回特定字符'<'前的文字
function filter(str){
    let res = str.split('<')[0];
    return res;
}

// 删除li项(防止页面刷新重新渲染时旧的数据仍在页面上) 传入不同的ol 删除其下所有的li结点
function removeLiBeforeRendering(orderlist){
    if(orderlist){
        while(orderlist.hasChildNodes()){ //当div下还存在子节点时 循环继续  
            orderlist.removeChild(orderlist.firstChild);
        }
    }
}

//页面刷新渲染数据结点
function load(){
    let toDoItems = new Array();

    let toDoStr = localStorage.getItem("todo");
    toDoItems = getArrData(toDoStr);
    
    // 从localStorage获取数据显示(使用 JSON.parse() 方法将数据转换为 JavaScript 对象)
    if(toDoItems){
        for(let i=0;i<toDoItems.length;i++){
            if(toDoItems[i].done === false){
                createDataLi(toDoItems[i].title);
            }
            if(toDoItems[i].done === true){
                createFinishedLi(toDoItems[i].title);
            }
        }
    }
}

/*点击刷新 需要将数据重新获取出来放到数组里面 
否则数组在刷新之后变成空的了 无法实现在原先基础上追加
(解决刷新页面脚本全局变量数据数组初始化导致数据丢失问题) 
与上次使用数据保持一致
*/
function reloadArrData(){
    //每次刷新页面时都执行此函数保证数据数组数据和上次保持一致
    let toDoStr = localStorage.getItem("todo");
    if(toDoStr){
        toDoArr = getArrData(toDoStr);
    }
    // console.log(toDoArr);
}
reloadArrData();
