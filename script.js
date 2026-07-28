const fields = [
"income",
"housing",
"utilities",
"groceries",
"transportation",
"insurance",
"phone",
"internet",
"entertainment",
"subscriptions",
"debt",
"other"
];


fields.forEach(id=>{

document.getElementById(id)
.addEventListener(
"input",
calculate
);

});



function calculate(){

let total = 0;


fields.forEach(id=>{

let value =
Number(document.getElementById(id).value)
||0;

total += value;

});


let income =
Number(
document.getElementById("income").value
)
||0;



let remaining =
income-total;



let rate =
income>0 ?
((remaining/income)*100).toFixed(1)
:0;



document.getElementById("expenses")
.innerText =
"$"+total;



document.getElementById("remaining")
.innerText =
"$"+remaining;



document.getElementById("rate")
.innerText =
rate+"%";

}





function analyzeBudget(){


let result =
document.getElementById("aiResult");


result.innerHTML =
`
<h3>🤖 AI is analyzing...</h3>
<p>
Reviewing your spending habits and financial goals.
</p>
`;



setTimeout(()=>{


result.innerHTML=

`
<h3>Budget Summary</h3>

<p>
Your AI financial coach will analyze:
</p>

<ul>
<li>Spending patterns</li>
<li>Saving opportunities</li>
<li>Goal progress</li>
<li>Budget improvements</li>
</ul>

<p>
Connect this button to your n8n webhook
to receive real AI recommendations.
</p>

`;


},1500);


}