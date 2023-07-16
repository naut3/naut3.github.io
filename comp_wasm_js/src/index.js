const wasm = import('../pkg').catch(console.error);

// 配置された要素
const input = document.getElementById("input");
const seed = document.getElementById("seed");
const MIN = document.getElementById("min");
const MAX = document.getElementById("max");
const run_button = document.getElementById("run_button");
const time_lim = document.getElementById("run_time");
const output_rs = document.getElementById("output_rs");
const output_js = document.getElementById("output_js");
const res_rs = document.getElementById("res_rs");
const res_js = document.getElementById("res_js");
const canvas = document.getElementById("Visualizer");
const context = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const M = 10000;

update_input();

MIN.addEventListener("change", update_input);
MAX.addEventListener("change", update_input);
seed.addEventListener("change", update_input);

run_button.addEventListener("click", solve);

let radios = document.querySelectorAll("input[type='radio']");
for (let b of radios) {
    b.addEventListener("change", function () {
        if (b.value == "rs") {
            context.clearRect(0, 0, WIDTH, WIDTH);
            gen_from_seed();
            draw_points();
            draw_route(output_rs.value, "rgb(255, 0, 0)");
        } else if (b.value == "js") {
            context.clearRect(0, 0, WIDTH, WIDTH);
            gen_from_seed();
            draw_points();
            draw_route(output_js.value, "rgb(0, 0, 255)");
        } else if (b.value == "double") {
            context.clearRect(0, 0, WIDTH, WIDTH);
            gen_from_seed();
            draw_points();
            draw_route(output_js.value, "rgb(0, 0, 255)");
            draw_route(output_rs.value, "rgb(255, 0, 0)");
        } else {
            context.clearRect(0, 0, WIDTH, WIDTH);
            gen_from_seed();
            draw_points();
        }
    })
}

function reset() {
    let radios = document.querySelectorAll("input[type='radio']");
    for (let b of radios) {
        if (b.value == "rs") {
            b.checked = false;
        } else if (b.value == "js") {
            b.checked = false;
        } else if (b.value == "double") {
            b.checked = false;
        } else {
            b.checked = true;
        }
    }
}

async function update_input() {
    context.clearRect(0, 0, WIDTH, WIDTH);
    await gen_from_seed();
    context.clearRect(0, 0, WIDTH, WIDTH);
    await draw_points();
    context.clearRect(0, 0, WIDTH, WIDTH);
    await draw_points();
    reset();
}

async function solve() {
    await context.clearRect(0, 0, WIDTH, WIDTH);

    await gen_from_seed();
    await draw_points();
    await tsp_rs();
    await tsp_js();

    res_js.value = score(output_js.value);
    res_rs.value = score(output_rs.value);
    reset();
}

// 頂点を描画する
async function draw_points() {
    let input_parsed = input.value.split("\n");
    let N = parseInt(input_parsed[0], 10);
    let P = [];

    for (let i = 0; i < N; i++) {
        let xy = input_parsed[i + 1].split(" ").map(x => parseInt(x, 10));
        let x = xy[0];
        let y = xy[1];
        P.push([x, y]);
    }

    for (let i = 0; i < N; i++) {
        let x = P[i][0];
        let y = P[i][1];

        let cx = WIDTH * x / M;
        let cy = HEIGHT - HEIGHT * y / M;

        context.beginPath();
        context.arc(cx, cy, 2, Math.PI * 2, 0, true);
        context.fill();
        context.stroke();
    }
}

// 経路を描画する
async function draw_route(output, col) {
    let input_parsed = input.value.split("\n");
    let N = parseInt(input_parsed[0], 10);
    let P = [];

    for (let i = 0; i < N; i++) {
        let xy = input_parsed[i + 1].split(" ").map(x => parseInt(x, 10));
        let x = xy[0];
        let y = xy[1];
        P.push([x, y]);
    }

    let output_parsed = output.split("\n").map(x => parseInt(x, 10));

    for (let i = 0; i < N; i++) {
        let now = output_parsed[i] - 1;
        let nxt = output_parsed[i + 1] - 1;

        let x1 = P[now][0];
        let y1 = P[now][1];
        let x2 = P[nxt][0];
        let y2 = P[nxt][1];

        let cx1 = WIDTH * x1 / M;
        let cy1 = HEIGHT - HEIGHT * y1 / M;
        let cx2 = WIDTH * x2 / M;
        let cy2 = HEIGHT - HEIGHT * y2 / M;

        context.fillStyle = col;
        context.beginPath();
        context.moveTo(cx1, cy1);
        context.lineTo(cx2, cy2);
        context.fill();
        context.stroke();
    }

    context.fillStyle = "rgb(0, 0, 0)";
}

// js の solver
function gen_range(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}

function dist(p1, p2) {
    let x1 = p1[0];
    let y1 = p1[1];
    let x2 = p2[0];
    let y2 = p2[1];
    return Math.round(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)))
}

async function tsp_js() {
    const start_time = Date.now();
    const input_data = input.value;
    const input_parsed = input_data.split("\n");
    const N = parseInt(input_parsed[0], 10);
    let P = [];

    for (let i = 0; i < N; i++) {
        let XY = input_parsed[i + 1].split(" ").map(x => parseInt(x, 10));
        let x = XY[0];
        let y = XY[1];
        P.push([x, y]);
    }

    let route = [0];
    let seen = Array(N).fill(false);
    seen[0] = true;

    for (let i = 1; i < N; i++) {
        let now = route[i - 1];

        let nxt = 0;

        for (let j = 1; j < N; j++) {
            if (!seen[j]) {
                if (nxt === 0) {
                    nxt = j;
                } else if (dist(P[nxt], P[now]) > dist(P[j], P[now])) {
                    nxt = j;
                }
            }
        }

        route.push(nxt);
        seen[nxt] = true;
    }

    route.push(0);

    while (Date.now() - start_time <= parseInt(time_lim.value, 10)) {
        let e1 = gen_range(0, N);
        let e2 = gen_range(0, N);

        if (e1 > e2) {
            let e_s1 = e1;
            let e_s2 = e2;
            e1 = e_s2;
            e2 = e_s1;
        }

        let a = route[e1];
        let b = route[e1 + 1];
        let c = route[e2];
        let d = route[e2 + 1];

        if (dist(P[a], P[b]) + dist(P[c], P[d]) > dist(P[a], P[c]) + dist(P[b], P[d])) {
            let nxt_route = [...route];
            for (let i = 0; i < e2 - e1; i++) {
                nxt_route[e1 + i + 1] = route[e2 - i];
            }

            route = [...nxt_route];

        }
    }

    let ret = "";
    for (let i = 0; i <= N; i++) {
        ret += String(route[i] + 1);

        if (i != N) {
            ret += "\n";
        }
    }

    output_js.value = ret;
}

// rs の solver
async function tsp_rs() {
    Promise.all([wasm]).then(async function ([{ tsp_2opt }]) {
        let route = tsp_2opt(input.value, parseInt(time_lim.value, 10));
        output_rs.value = route;
    })
}

async function gen_from_seed() {
    Promise.all([wasm]).then(async function ([{ generate_problem }]) {
        let problem_settings = generate_problem(parseInt(seed.value, 10), parseInt(MIN.value, 10), parseInt(MAX.value, 10));
        input.value = problem_settings;
    })
}

function score(output) {
    let input_parsed = input.value.split("\n");
    let N = parseInt(input_parsed[0], 10);
    let P = [];

    let ret = 0;

    for (let i = 0; i < N; i++) {
        let xy = input_parsed[i + 1].split(" ").map(x => parseInt(x, 10));
        let x = xy[0];
        let y = xy[1];
        P.push([x, y]);
    }

    let output_parsed = output.split("\n").map(x => parseInt(x, 10));

    for (let i = 0; i < N; i++) {
        let now = output_parsed[i] - 1;
        let nxt = output_parsed[i + 1] - 1;
        ret += dist(P[now], P[nxt]);
    }
    return ret
}

