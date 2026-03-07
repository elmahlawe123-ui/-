function addItem(){

let name=document.getElementById("itemName").value;

let qty=document.getElementById("qty").value;

if(!name||!qty) return alert("اكمل البيانات");

let table=document.querySelector("#table tbody");

let row=table.insertRow();

row.innerHTML=

"<td>"+name+"</td>"+

"<td>"+qty+"</td>"+

"<td><button onclick='this.parentElement.parentElement.remove()'>X</button></td>";

saveDraft();

document.getElementById("itemName").value="";

document.getElementById("qty").value="";

document.getElementById("itemName").focus();

}

function saveDraft(){

let rows=[];

document.querySelectorAll("#table tbody tr").forEach(r=>{

rows.push({

name:r.cells[0].innerText,

qty:r.cells[1].innerText

});

});

localStorage.setItem("draft",JSON.stringify(rows));

localStorage.setItem("client",document.getElementById("clientName").value);

}

function loadDraft(){

let rows=JSON.parse(localStorage.getItem("draft")||"[]");

let client=localStorage.getItem("client")||"";

document.getElementById("clientName").value=client;

let table=document.querySelector("#table tbody");

rows.forEach(i=>{

let row=table.insertRow();

row.innerHTML=

"<td>"+i.name+"</td>"+

"<td>"+i.qty+"</td>"+

"<td><button onclick='this.parentElement.parentElement.remove()'>X</button></td>";

});

}

function exportExcel(){

let rows=document.querySelectorAll("#table tbody tr");

let data=[["الصنف","الكمية"]];

rows.forEach(r=>{

data.push([

r.cells[0].innerText,

r.cells[1].innerText

]);

});

let ws=XLSX.utils.aoa_to_sheet(data);

let wb=XLSX.utils.book_new();

XLSX.utils.book_append_sheet(wb,ws,"طلب");

XLSX.writeFile(wb,"طلب.xlsx");

}

function exportPDF(){

const {jsPDF}=window.jspdf;

let doc=new jsPDF();

doc.text("كشف طلب بضاعة",105,20,null,null,"center");

let y=40;

document.querySelectorAll("#table tbody tr").forEach(r=>{

doc.text(r.cells[0].innerText,20,y);

doc.text(r.cells[1].innerText,180,y,null,null,"right");

y+=10;

});

doc.save("طلب.pdf");

}

function sendWhatsApp(){

let msg="طلب بضاعة%0A";

document.querySelectorAll("#table tbody tr").forEach(r=>{

msg+=r.cells[0].innerText+" : "+r.cells[1].innerText+"%0A";

});

window.open("https://wa.me/?text="+msg);

}

function exportImage(){

let area=document.getElementById("exportArea");

let client=document.getElementById("clientName").value;

document.getElementById("expClient").innerText="العميل : "+client;

let table=document.getElementById("expTable");

table.innerHTML="";

document.querySelectorAll("#table tbody tr").forEach(r=>{

table.innerHTML+=

"<tr><td>"+r.cells[0].innerText+"</td><td>"+r.cells[1].innerText+"</td></tr>";

});

area.style.display="block";

html2canvas(area).then(canvas=>{

let link=document.createElement("a");

link.download="طلب.png";

link.href=canvas.toDataURL();

link.click();

area.style.display="none";

});

}

function clearTable(){

if(confirm("مسح الجدول؟")){

document.querySelector("#table tbody").innerHTML="";

localStorage.removeItem("draft");

}

}

document.getElementById("qty").addEventListener("keypress",function(e){

if(e.key==="Enter") addItem();

});

window.onload=loadDraft;
