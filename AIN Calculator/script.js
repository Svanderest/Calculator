var txtCalc;
var txtRes;
var lastOp;
var intParCount;

function initialize()
{
	txtCalc = document.getElementById("calc");
	txtRes = document.getElementById("res");
	txtRes.value = "0";
	txtCalc.value = null;
	lastOp = -1;
	intParCount = 0;
}

function btnNumber(input)
{
	if(input == ")")
	{
		if(intParCount == 0)
			return;
		else
			intParCount--;
	}
	if(input == "(")
		intParCount++;
	if(input == ".") 
	{
		if(lastOp<txtCalc.value.lastIndexOf("."))
			return;
		if(isNaN(txtCalc.value[txtCalc.value.length-1]))
			input = "0."
	}
	if(input == "0" && parseFloat(txtCalc.value.slice(lastOp+1,txtCalc.value.length-1)) == 0)
		return;
	if(txtCalc.value[txtCalc.value.length-1] == "=" || txtCalc.value.length == 0)
	{
		if(isOp(input))
		{
			if(txtRes.value == "Error")
				txtCalc.value = "0"
			else
				txtCalc.value = txtRes.value;
		}
		else
			txtCalc.value = null;
	}
	if(isOp(input))
	{
		if(lastOp == txtCalc.value.length-1)
			return;
		else
			lastOp = txtCalc.value.length;
	}
	txtCalc.value += input.toString();
}

function btnEquals()
{
	for(i=0;i<intParCount;i++)
		txtCalc.value += ")";
	txtRes.value = calculate(txtCalc.value);
	if(isNaN(txtRes.value))
		txtRes.value = "Error";
	txtCalc.value += "=";
	document.activeElement.blur();
	lastOp = -1;
	intParCount = 0;
}

function btnClear()
{
	if(txtCalc.value.length == 0)
		txtRes.value = "0";
	else
		txtCalc.value = null;
}

function btnSign()
{
	if(txtCalc.value[txtCalc.value.length-1] == "=")
	{
		if(txtRes.value == "Error")
			return;
		else
			txtCalc.value = txtRes.value;
	}
	if(txtCalc.value[lastOp+1] == "-")
		txtCalc.value = txtCalc.value.slice(0,lastOp+1) + txtCalc.value.slice(lastOp+2,txtCalc.value.length);
	else
		txtCalc.value = txtCalc.value.slice(0,lastOp+1) + "-" + txtCalc.value.slice(lastOp+1,txtCalc.value.length);
}

function keyPress(event)
{
	let colour;
	let btn;
	if(event.key == "*")
		btn = document.getElementById("X");
	else
	 	btn = document.getElementById(event.key.toUpperCase());
	if(btn != null)
	{
		switch(event.key.toUpperCase())
		{
			case "C": 	btnClear()
						break;
			case "-": 	btnNumber("–")
						break;
			case "ENTER": 	btnEquals();
							break;
			default: 	if(event.key == "*")
							btnNumber("X");
						else
							btnNumber(event.key);
						break;
		}
		if(isNaNChar(event.key) || event.key == "-" || event.key == "*")
			colour = "aaa;";
		else
			colour = "ddd;";
		btn.style = "background-color: #" + colour;
	}
}

function keyRelease()
{
	let btns = document.getElementsByTagName("input");
	for(i of btns)
		i.style = null;
}


function calculate(calcString)
{
	let error = false;
	let orderOfOps = ["/","X","–","+"];
	let strStart;
	let strMid;
	let strEnd;
	while(calcString.indexOf(")") != -1)
	{
		for(i=calcString.indexOf(")"); calcString[i] != "("; i--);
		if(i != 0)
			strStart = calcString.slice(0,i);
		else
			strStart = "";
		if(calcString.indexOf(")") != calcString.length-1)
			strEnd = calcString.slice(calcString.indexOf(")")+1,calcString.length)
		else
			strEnd = "";
		strMid = calcString.slice(i+1,calcString.indexOf(")"));
		calcString = strStart + calculate(strMid) + strEnd;
	}
	for(op of orderOfOps)
	{
		while(calcString.indexOf(op) != -1)
		{
			let nextOp = getNextOp(calcString.indexOf(op),calcString);
			let prevOp = getPrevOp(calcString.indexOf(op),calcString);
			let x = calcString.slice(prevOp+1,calcString.indexOf(op));
			let y = calcString.slice(calcString.indexOf(op)+1,nextOp);
			let res;
			switch(op)
			{
				case "/": if(y == 0)
							res = NaN;
						  else
							res = x/y;
						  break;
				case "X": res = x*y;
						  break;
				case "–": res = x-y;
						  break;
				case "+": res = parseFloat(x) + parseFloat(y);
						  break;
			}
			if(prevOp>0)
				res = calcString.slice(0,prevOp+1);
			if(nextOp<calcString.length-1)
				res += calcString.slice(nextOp,calcString.length);
			calcString = res.toString();
		}
	}
	return calcString;
}
function getPrevOp(index,string)
{
	for(var i=index-1; i>=0; i--)
	{
		if(isNaNChar(string[i]))
			break;
	}
	return i;
}

function getNextOp(index,string)
{
	for(var i=index+1; i<string.length; i++)
	{
		if(isNaNChar(string[i]))
			break;
	}
	return i;
}

function isNaNChar(input)
{
	let nChars = ["1","2","3","4","5","6","7","8","9","0",".","-"];
	return !nChars.includes(input);

}

function isOp(input)
{
	let opChars = ["/","X","+","–"]
	return opChars.includes(input);
}