var score = 0;
var num1 = 1;
var num2 = 2;
var op = 1;
var operator = '+';
var result = 3;

function dis(val){
    document.getElementById("typing").value += val
}
function clr(){
    document.getElementById("typing").value = ""
}
function new_turn(){
    score = 0;
    num1 = 1;
    num2 = 2;
    op = 1;
    operator = '+';
    result = 3;
    clr();
    document.getElementById("num1").textContent = num1;
    document.getElementById("num2").textContent = num2;
    document.getElementById("op").textContent = operator;
    document.getElementById('score').textContent = score;
}
function entr() {
    result = Math.floor(eval(num1 + operator + num2));
    if (result == document.getElementById('typing').value) {
        num1 = Math.floor(Math.random() * ((score + 100) / 10 - (score+10) / 10) + (score+10) / 10);
        num2 = Math.floor(Math.random() * ((score + 100) / 10 - (score + 10) / 10) + (score + 10) / 10);
        op = Math.floor(Math.random() * (5 - 1) + 1);
        if (op == 1) { operator = '+'; }
        else if (op == 2) { operator = '-'; }
        else if (op == 3) { operator = '*'; }
        else if (op == 4) { 
            operator = '/'; 
            var temp = num1;
            num1*= num2;
            num2 = temp;
    }
        document.getElementById("num1").textContent = num1;
        document.getElementById("num2").textContent = num2;
        document.getElementById("op").textContent = operator;
        document.getElementById('typing').value = "";
        score += 10;
        document.getElementById('score').textContent = score;
    }
    else if (result !== document.getElementById('typing').value) {
        document.getElementById('question').style.display = "none";
        document.getElementById('hide_table').style.display = "none";
        document.getElementById('form').style.display = "block";
    }
}

window.onload=function(){
    const domain = "https://api-and-websockets.herokuapp.com";
    let saveScoreBtn = document.querySelector("#b1");
            saveScoreBtn.onclick = async () => {
                console.log("start saving the score")
                let board_name = document.querySelector("#h2").value
                let board_pass = document.querySelector("#h1").value
                let score_name = document.querySelector("#t1").value
                let url = domain + "/api/save_score/"
                let data = await fetch(url , {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
                        "board": board_name,
                        "password": board_pass,
                        "score": parseInt(score),
                         // you have to send data with the right datatype
                        "name": score_name
                    })
                })
                document.getElementById('question').style.display = "block";
                document.getElementById("hide_table").style.display="block";
                document.getElementById("form").style.display="none";
                let name = document.querySelector("#h2").value;
                build_board(name);
                new_turn();
            }
    let showBtn = document.querySelector("#r1")
            let build_board = async (name) => {
                let url = domain + `/api/get_scores/${name}/` // you can change this to "https://api-and-websockets.herokuapp.com/api/get_scores"
                console.log(url);
                let data = await fetch(url)
                data = await data.json()            
                let container = document.querySelector("#leaderboard")
                container.innerHTML = `<h1 class="text-center">Leaderboard</h1>
                <div class="row">
                    <button class="btn btn-primary" id="r1">Refresh</button>
                </div>
                <div class="row mt-3">
                    <div class="col-3 container-md p-1 bg-light text-dark">
                        <p>Rank</p>
                    </div>
                    <div class="col-5 container-md p-1 bg-light text-dark">
                        <p>Name</p>
                    </div>
                    <div class="col-4 container-md p-1 bg-light text-dark">
                        <p>Score</p>
                    </div>
                </div>`
                var i=0;
                for (item of data){
                    if( item.score%10==0 ){
                        i++;
                        tag = `<div class="row border rounded mt-1 mb-2">
                        <div class="col-3 p-1 bg-light text-dark" id='ranks'>
                            <p>${i}</p>
                        </div>
                        <div class="col-5 p-1 bg-light text-dark" id='names'>
                            <p>${item.name}</p>
                        </div>
                        <div class="col-4 p-1 bg-light text-dark" id='scores'>
                            <p>${item.score}</p>
                        </div>
                    </div>`
                        container.innerHTML += tag
                    }
                }
            }
            showBtn.addEventListener("click", ()=>{
                let name = document.querySelector("#h2").value;
                build_board(name);
            } )
            let name = document.querySelector("#h2").value;
            build_board(name);
}