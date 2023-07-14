class Vertex {
    constructor(x, y, i = 0) {
        this.x = x;
        this.y = y;
        this.index = i;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, R, 0, 2 * Math.PI);
        context.fill();
        context.closePath();

        if (need_to_show_index()) {
            context.font = "20px Roboto medium";

            let index = this.index;
            if (!is_0_indexed()) {
                index += 1;
            }

            let pos = document.getElementById("position").value;
            let x;
            let y;

            if (pos == "UpL") {
                x = this.x - 1.3 * R;
                y = this.y - 1.3 * R;
            } else if (pos == "R") {
                x = this.x + 1.3 * R;
                y = this.y + 0.5 * R;
            } else if (pos == "Lo") {
                x = this.x - 0.5 * R;
                y = this.y + 2.3 * R;
            }

            context.fillText(index, x, y);
        }
    }
}

class Edge {
    constructor(from, to, weight = 1) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }

    draw() {
        context.beginPath();
        context.moveTo(vertex[this.from].x, vertex[this.from].y);
        context.lineTo(vertex[this.to].x, vertex[this.to].y);
        context.fill();
        context.closePath();
        context.stroke();

        if (is_directed()) {
            this.draw_arrow();
        }

        if (need_to_show_weight()) {
            this.draw_weight();
        }
    }

    draw_arrow() {
        let x1 = vertex[this.from].x;
        let y1 = vertex[this.from].y;
        let x2 = vertex[this.to].x;
        let y2 = vertex[this.to].y;

        let dx = x2 - x1;
        let dy = y2 - y1;
        let dist = Math.sqrt(dx * dx + dy * dy);

        let nx = dx / dist;
        let ny = dy / dist;

        let sx1 = x2 - nx * R;
        let sy1 = y2 - ny * R;

        let sx2 = x2 - nx * R + (Math.cos(Math.PI - T) * nx - Math.sin(Math.PI - T) * ny) * A;
        let sy2 = y2 - ny * R + (Math.sin(Math.PI - T) * nx + Math.cos(Math.PI - T) * ny) * A;

        let sx3 = x2 - nx * R + (Math.cos(Math.PI + T) * nx - Math.sin(Math.PI + T) * ny) * A;
        let sy3 = y2 - ny * R + (Math.sin(Math.PI + T) * nx + Math.cos(Math.PI + T) * ny) * A;

        context.beginPath();
        context.moveTo(sx1, sy1);
        context.lineTo(sx2, sy2);
        context.moveTo(sx1, sy1);
        context.lineTo(sx3, sy3);
        context.fill();
        context.closePath();
        context.stroke();
    }

    draw_weight() {
        let x1 = vertex[this.from].x;
        let y1 = vertex[this.from].y;
        let x2 = vertex[this.to].x;
        let y2 = vertex[this.to].y;

        let dx = x2 - x1;
        let dy = y2 - y1;
        let dist = Math.sqrt(dx * dx + dy * dy);

        let nx = dx / dist;
        let ny = dy / dist;

        let mx = (x1 + x2) / 2.0;
        let my = (y1 + y2) / 2.0;
        context.font = "20px Roboto medium";
        context.fillText(this.weight, mx - ny * R, my + nx * R);
    }
}

// 0-indexed かどうかを調べる。
function is_0_indexed() {
    return document.getElementsByName("indexed").item(0).checked
}

// 有向グラフかどうかを調べる。
function is_directed() {
    return document.getElementsByName("direction").item(0).checked
}

// 重み付きグラフかどうかを調べる。
function is_weighted() {
    return document.getElementsByName("weight").item(0).checked
}

// インデックスを表示するにチェックが入っているかを調べる。
function need_to_show_index() {
    return document.getElementsByName("show_index").item(0).checked
}

// 重みを表示するにチェックが入っているかを調べる。
function need_to_show_weight() {
    return document.getElementsByName("show_edge_weight").item(0).checked
}

// 現在のグラフの情報から、グラフを描画する。
function draw_all() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
        let N = vertex.length;
        let M = edge.length;
        for (let i = 0; i < N; i++) {
            vertex[i].draw();
        }

        for (let i = 0; i < M; i++) {
            let u = edge[i].from;
            let v = edge[i].to;

            if (!(0 <= u && u < N && 0 <= v && v < N)) {
                throw new Error();
            }
            edge[i].draw();
        }
    } catch {
        // 入力が異常であるときは、その旨を表示する.
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = "20px Roboto medium";
        context.fillStyle = "#ff0000";
        context.fillText("Failed to parse", 5, 20);
        context.fillStyle = "#000000";
    }


}

// 区間 [a, b] の範囲で整数の乱数を生成する。
function randint(a, b) {
    return Math.floor(Math.random() * (b - a) + a)
}

// canvasの横幅を取得する
function get_width() {
    return document.getElementById("canvas").width
}

// canvasの縦幅を取得する
function get_height() {
    return document.getElementById("canvas").height
}

// フォームの情報を読み取って、グラフを描画する。
function init() {
    vertex = [];
    edge = [];
    q = [];

    let input_parsed = input.value.split("\n");
    let L = input_parsed.length;
    for (let i = 0; i < L; i++) {
        input_parsed[i] = input_parsed[i].split(" ").map(x => parseInt(x, 10));
    }

    const N = input_parsed[0][0];
    const M = input_parsed[0][1];

    for (let i = 0; i < N; i++) {
        // arrangementの設定に従って、初期位置を決める
        let v
        if (document.getElementsByName("arrangement").item(0).checked) {
            v = new Vertex(Mx + D * i, My, i);
        } else if (document.getElementsByName("arrangement").item(1).checked) {
            v = new Vertex(randint(R, get_width() - R), randint(R, get_height() - R), i);
        }


        vertex.push(v);
    }

    for (let i = 0; i < M; i++) {
        let e;
        let u = input_parsed[i + 1][0];
        let v = input_parsed[i + 1][1];
        let w = 1;
        if (is_weighted()) {
            w = input_parsed[i + 1][2];
        }

        if (!is_0_indexed()) {
            u -= 1;
            v -= 1;
        }
        e = new Edge(u, v, w);
        edge.push(e);
    }

    draw_all();
}

// マウスの動きに追従して、グラフの頂点を移動させる処理を記述する。
let move = (e) => {
    if (q.length == 0) {
        let N = vertex.length;
        let rect = e.target.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        for (let i = 0; i < N; i++) {
            let dist = (x - vertex[i].x) * (x - vertex[i].x) + (y - vertex[i].y) * (y - vertex[i].y);
            if (dist <= R * R) {
                q.push(i);
                break
            }
        }
    }

    if (q.length == 1) {
        let rect = e.target.getBoundingClientRect();

        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        vertex[q[0]].x = x;
        vertex[q[0]].y = y;
    }

    draw_all();
}


let vertex = [];
let edge = [];
let q = [];

// グラフの頂点の半径
const R = 15;
// 矢印の大きさ
const A = 10;
// 矢印の開く角度
const T = Math.PI / 8;

// 初期位置のマージン
const Mx = 30;
const My = 45;
const D = 60;

const input = document.getElementById("input");
const radio_buttons = document.querySelectorAll("input[type=radio]");
const need_regenerate_area = document.querySelectorAll("[regenerate=true]");
const need_redraw_area = document.querySelectorAll("[redraw=true]");
const canvas = document.getElementById("canvas");
canvas.style.border = "1px solid";
const context = canvas.getContext("2d");

// 入力値が変更したら、グラフを再度読み込む
need_regenerate_area.forEach(function (area) {
    area.addEventListener("change", init);
})
need_redraw_area.forEach(function (area) {
    area.addEventListener("change", draw_all);
})



// 初期値での描画
init()

// 頂点をドラッグ&ドロップで移動できるようにする
canvas.addEventListener("mousedown", () => {
    canvas.addEventListener("mousemove", move);
});
canvas.addEventListener("mouseup", () => {
    canvas.removeEventListener("mousemove", move);
    q = [];
    draw_all();
})