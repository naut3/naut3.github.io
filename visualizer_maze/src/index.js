const N = 101;
const wasm = import('../pkg').catch(console.error);

// 入力処理
const seed_input = document.getElementById("seed");
seed_input.addEventListener("change", regen);
seed_input.value = 0;

// 迷路の生成
function gen() {
    Promise.all([wasm]).then(function ([{ generate_maze }]) {
        let seed = seed_input.value;
        let maze = generate_maze(parseInt(seed, 10));
        document.getElementById("input").value = maze;
    });
}

// 出力処理
const output = document.getElementById("output");
output.addEventListener("change", draw_route);

// 描画処理
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const WIDTH = canvas.width;
const CELL_SIZE = WIDTH / N;
const input = document.getElementById("input");
input.addEventListener("change", init);
seed_input.addEventListener("change", init);
const time_range = document.getElementById("time");
time_range.addEventListener("change", bar_gen);

// 迷路の描画
function draw_maze() {
    context.clearRect(0, 0, WIDTH, WIDTH);
    let input = document.getElementById("input");
    let input_data = input.value.split("\n");
    let S = input_data.slice(3);

    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            let s = S[i][j];
            if (s == '#') {
                context.fillStyle = "rgb(180, 180, 180)";
                context.fillRect(CELL_SIZE * j, CELL_SIZE * i, CELL_SIZE, CELL_SIZE);
            } else if (s == 'S') {
                context.fillStyle = "rgb(0, 255, 0)";
                context.fillRect(CELL_SIZE * j, CELL_SIZE * i, CELL_SIZE, CELL_SIZE);
            } else if (s == 'G') {
                context.fillStyle = "rgb(255, 0, 0)";
                context.fillRect(CELL_SIZE * j, CELL_SIZE * i, CELL_SIZE, CELL_SIZE);
            } else if (s == 'C') {
                context.fillStyle = "rgb(255, 255, 0)";
                context.fillRect(CELL_SIZE * j, CELL_SIZE * i, CELL_SIZE, CELL_SIZE);
            }
            context.fill();
        }
    }
}

// 経路の描画
function draw_route() {
    let input_data = input.value.split("\n");
    let S = input_data.slice(3);
    let start = input_data[1].split(" ").map(x => parseInt(x, 10));
    let sy = start[0] - 1;
    let sx = start[1] - 1;
    let end = input_data[2].split(" ").map(x => parseInt(x, 10));
    let ty = end[0] - 1;
    let tx = end[1] - 1;
    let K = input_data[0].split(" ").map(x => parseInt(x, 10))[1];

    let seen = [];
    let cnt = 0;

    let output_data = output.value.split("\n");
    let route = output_data[0];

    context.lineWidth = 3;

    for (let i = 0; i < route.length; i++) {
        context.beginPath();
        context.moveTo(sx * CELL_SIZE + CELL_SIZE / 2, sy * CELL_SIZE + CELL_SIZE / 2);
        let d = route[i];

        if (d == 'L') {
            if (S[sy][sx - 1] != '#') {
                sx -= 1;
            } else {
                parse_failed();
                return
            }
        } else if (d == 'R') {
            if (S[sy][sx + 1] != '#') {
                sx += 1;
            } else {
                parse_failed();
                return
            }
        } else if (d == 'U') {
            if (S[sy - 1][sx] != '#') {
                sy -= 1;
            } else {
                parse_failed();
                return
            }
        } else if (d == 'D') {
            if (S[sy + 1][sx] != '#') {
                sy += 1;
            } else {
                parse_failed();
                return
            }
        } else {
            parse_failed();
        }

        context.lineTo(sx * CELL_SIZE + CELL_SIZE / 2, sy * CELL_SIZE + CELL_SIZE / 2);
        context.fill();
        context.closePath();
        context.stroke();

        if (S[sy][sx] == 'C' && seen[sy * N + sx] !== true) {
            seen[sy * N + sx] = true;
            cnt += 1;
        }
    }

    if (cnt === K && sy == ty && sx == tx) {
        document.getElementById("result").textContent = "Score: " + route.length;

        time_range.max = route.length;
        time_range.value = time_range.max;
    }

    function parse_failed() {
        document.getElementById("result").textContent = "Failed Parse";
        draw_maze();
    }

}

function draw_middle_route() {
    let input_data = input.value.split("\n");
    let S = input_data.slice(3);
    let start = input_data[1].split(" ").map(x => parseInt(x, 10));
    let sy = start[0] - 1;
    let sx = start[1] - 1;
    let end = input_data[2].split(" ").map(x => parseInt(x, 10));
    let ty = end[0] - 1;
    let tx = end[1] - 1;
    let K = input_data[0].split(" ").map(x => parseInt(x, 10))[1];

    let seen = [];
    let cnt = 0;

    let output_data = output.value.split("\n");
    let route = output_data[0];
    route = route.slice(0, time_range.value);

    context.lineWidth = 3;

    for (let i = 0; i < route.length; i++) {
        context.beginPath();
        context.moveTo(sx * CELL_SIZE + CELL_SIZE / 2, sy * CELL_SIZE + CELL_SIZE / 2);
        let d = route[i];

        if (d == 'L') {
            if (S[sy][sx - 1] != '#') {
                sx -= 1;
            } else {
                parse_failed();
                return
            }
        } else if (d == 'R') {
            if (S[sy][sx + 1] != '#') {
                sx += 1;
            } else {
                parse_failed();
                return
            }
        } else if (d == 'U') {
            if (S[sy - 1][sx] != '#') {
                sy -= 1;
            } else {
                parse_failed();
                return
            }
        } else if (d == 'D') {
            if (S[sy + 1][sx] != '#') {
                sy += 1;
            } else {
                parse_failed();
                return
            }
        } else {
            parse_failed();
        }

        context.lineTo(sx * CELL_SIZE + CELL_SIZE / 2, sy * CELL_SIZE + CELL_SIZE / 2);
        context.fill();
        context.closePath();
        context.stroke();

        if (S[sy][sx] == 'C' && seen[sy * N + sx] !== true) {
            seen[sy * N + sx] = true;
            cnt += 1;
        }
    }

    if (cnt === K && sy == ty && sx == tx) {
        document.getElementById("result").textContent = "Score: " + route.length;
    }

    function parse_failed() {
        document.getElementById("result").textContent = "Failed Parse";
        draw_maze();
    }
}

init();

function init() {
    draw_maze();
    draw_route();
}

function regen() {
    gen();
    draw_maze();
    draw_route();
}

function bar_gen() {
    draw_maze();
    draw_middle_route();
}