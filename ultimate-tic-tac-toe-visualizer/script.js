const input_form = document.getElementById("game-flow-text");
const turn_bar = document.getElementById("turn-count");
const turn_counter = document.getElementById("turn-count-text");

const LY = 9;
const LX = 9;

function large_flatten(y, x) {
    return y * LX + x
}

function large_unflatten(p) {
    return Array(p / LX, p % LX)
}

let present_log = null;

// 盤面表示を行うためのtable生成
const table = document.createElement("table");

for (let i = 0; i < LY; i++) {
    let row = document.createElement("tr");

    for (let j = 0; j < LX; j++) {
        let cell = document.createElement("td");

        cell.style.width = "45px";
        cell.style.height = "45px";
        cell.style.textAlign = "center";
        cell.style.fontSize = "20px";

        if ((i == 2) || (i == 5)) {
            cell.style.borderBottom = "2px solid"
        }

        if ((j == 2) || (j == 5)) {
            cell.style.borderRight = "2px solid"
        }

        row.appendChild(cell);
    }

    table.appendChild(row);
}

document.body.appendChild(table);
table.setAttribute("border", "1");
table.setAttribute("style", "border-collapse: collapse");

// 入力フォームの内容をパースして、[(int, int)] にする
function parse_input() {
    let value = input_form.value;
    value = value.split("\n");

    let movements = Array()

    for (let v of value) {
        let yx = v.split(" ");
        let y = parseInt(yx[0], 10);
        let x = parseInt(yx[1], 10);
        movements.push([y, x]);
    }

    return movements
}

// 3つのBitBoardを受け取って、盤面を描画する
function visualize(board_information) {
    let board_first = board_information[0];
    let board_second = board_information[1];
    let legal_movement = board_information[2];

    for (let y = 0; y < LY; y++) {
        for (let x = 0; x < LX; x++) {
            table.rows[y].cells[x].style.backgroundColor = "rgba(0, 0, 0, 0)";
            table.rows[y].cells[x].innerHTML = "";

            if (((board_first >> BigInt(large_flatten(y, x))) & BigInt(1)) == BigInt(1)) {
                table.rows[y].cells[x].innerHTML = "◯";
            }

            else if (((board_second >> BigInt(large_flatten(y, x))) & BigInt(1)) == BigInt(1)) {
                table.rows[y].cells[x].innerHTML = "☓";
            }

            else if (((legal_movement >> BigInt(large_flatten(y, x))) & BigInt(1)) == BigInt(1)) {
                table.rows[y].cells[x].style.backgroundColor = "rgba(0, 255, 0, 0.25)";
            }
        }
    }

    // 揃った小盤面の色を塗る
    let origin_xs = [0, 3, 6, 0, 3, 6, 0, 3, 6];
    let origin_ys = [0, 0, 0, 3, 3, 3, 6, 6, 6];
    let dxs = [[0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 0, 0], [1, 1, 1], [2, 2, 2], [0, 1, 2], [2, 1, 0]];
    let dys = [[0, 0, 0], [1, 1, 1], [2, 2, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2], [0, 1, 2]];

    for (let i = 0; i < 9; i++) {
        let oy = origin_ys[i];
        let ox = origin_xs[i];

        for (let j = 0; j < 8; j++) {
            let cnt_first = 0;
            let cnt_second = 0;

            for (let k = 0; k < 3; k++) {
                let dy = dys[j][k];
                let dx = dxs[j][k];

                let y = oy + dy;
                let x = ox + dx;

                if (((board_first >> BigInt(large_flatten(y, x))) & BigInt(1)) == BigInt(1)) {
                    cnt_first += 1;
                }

                else if (((board_second >> BigInt(large_flatten(y, x))) & BigInt(1)) == BigInt(1)) {
                    cnt_second += 1;
                }
            }

            if (cnt_first == 3) {
                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        table.rows[oy + dy].cells[ox + dx].style.backgroundColor = "rgba(255, 0, 0, 0.25)";
                    }
                }
            }
            else if (cnt_second == 3) {
                for (let dx = 0; dx < 3; dx++) {
                    for (let dy = 0; dy < 3; dy++) {
                        table.rows[oy + dy].cells[ox + dx].style.backgroundColor = "rgba(0, 0, 255, 0.25)";
                    }
                }
            }
        }
    }
}

function calculate_game_states(actions) {
    let board_first = BigInt(0);
    let board_second = BigInt(0);

    let is_first = true;
    let ret = Array(Array(BigInt(0), BigInt(0), BigInt(0)));

    for (let action of actions) {
        let y = action[0];
        let x = action[1];
        let p = large_flatten(y, x);
        let p_binary = BigInt(1) << BigInt(p);

        if (is_first) {
            board_first |= p_binary;
        } else {
            board_second |= p_binary;
        }

        ret.push(Array(board_first, board_second, BigInt(0)));
        is_first = !is_first;
    }

    return ret
}

turn_bar.addEventListener("change", update_visualizer);
input_form.addEventListener("change", update_inputtext);

function update_inputtext() {
    present_log = calculate_game_states(parse_input());
    update_visualizer();
}

function update_visualizer() {
    if (present_log === null) {
        present_log = calculate_game_states(parse_input());
    }

    console.log("turn bar updated");

    // レンジバーの上限、下限を書き換える
    turn_bar.max = present_log.length - 1;
    turn_bar.min = 0;

    // レンジバーの値を取得して盤面を書き換える
    let value = turn_bar.value;
    turn_counter.innerText = value;

    visualize(present_log[value]);
}

input_form.value = "8 5\n8 6\n7 1\n4 4\n3 5\n0 7\n1 5\n5 6\n8 2\n8 8\n7 8\n4 8\n3 6\n2 1\n7 3\n3 0\n1 2\n5 8\n6 8\n0 6\n2 0\n8 1\n8 3\n6 0\n0 2\n1 6\n4 0\n3 2\n2 7\n7 4\n4 5\n3 8\n0 8\n1 7\n5 3\n6 2\n1 8\n2 4\n8 4\n2 8\n7 6\n3 1\n0 3\n0 1\n2 3\n7 2\n6 6\n1 0\n0 5\n6 7\n1 3\n8 0\n6 1\n2 2\n8 7\n5 5\n7 7\n3 3"
