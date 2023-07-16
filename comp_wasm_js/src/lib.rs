// [dependencies]
// wasm-bindgen = "0.2.84"
// proconio = "0.3.6"
// rand = { version = "=0.7.3", features = ["small_rng"] }
// wasm-timer = "0.2.5"
mod utils;
use rand::{rngs::SmallRng, SeedableRng};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn tsp_2opt(dat: &str, time_lim_ms: u32) -> String {
    tsp_2opt_inner(dat, time_lim_ms)
}

#[wasm_bindgen]
pub fn generate_problem(s: u8, n_min: usize, n_max: usize) -> String {
    generate_problem_inner(s, n_min, n_max)
}

#[wasm_bindgen]
pub fn calc_score(input: &str, output: &str) -> usize {
    calc_score_inner(input, output)
}

fn tsp_2opt_inner(dat: &str, time_lim_ms: u32) -> String {
    use proconio::{input, source::once::OnceSource};
    use rand::Rng;
    use wasm_timer::Instant;
    let time = Instant::now();

    let mut rng = SmallRng::seed_from_u64(time.elapsed().as_millis() as u64);
    let source = OnceSource::from(dat);

    input! {
        from source,
        N: usize,
        XY: [(isize, isize); N],
    }

    let mut route = vec![0];
    let mut seen = vec![false; N];
    seen[0] = true;

    let dist = |(x1, y1), (x2, y2)| {
        (((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) as f64)
            .sqrt()
            .round() as usize
    };

    for _ in 1..N {
        let now = route[route.len() - 1];

        let mut nxt = 0;

        for j in 1..N {
            if !seen[j] {
                if nxt == 0 {
                    nxt = j;
                } else if dist(XY[nxt], XY[now]) > dist(XY[j], XY[now]) {
                    nxt = j;
                }
            }
        }

        route.push(nxt);
        seen[nxt] = true;
    }

    route.push(0);

    while time.elapsed().as_millis() < time_lim_ms as u128 {
        let mut e1 = rng.gen_range(0, N);
        let mut e2 = rng.gen_range(0, N);

        if e1 > e2 {
            std::mem::swap(&mut e1, &mut e2);
        }

        let a = route[e1];
        let b = route[e1 + 1];
        let c = route[e2];
        let d = route[e2 + 1];

        if dist(XY[a], XY[b]) + dist(XY[c], XY[d]) > dist(XY[a], XY[c]) + dist(XY[b], XY[d]) {
            let mut nxt_route = route.clone();

            for i in 0..(e2 - e1) {
                nxt_route[e1 + i + 1] = route[e2 - i];
            }

            route = nxt_route;
        }
    }

    return format!(
        "{}",
        route
            .iter()
            .map(|x| (x + 1).to_string())
            .collect::<Vec<_>>()
            .join("\n")
    );
}

fn generate_problem_inner(s: u8, n_min: usize, n_max: usize) -> String {
    use rand::prelude::*;

    let seed = [s; 32];
    let mut rng: rand::rngs::StdRng = rand::SeedableRng::from_seed(seed);

    let N = rng.gen_range(n_min, n_max + 1);
    const M: usize = 10000;
    let mut pos = std::collections::BTreeSet::new();

    while pos.len() < N {
        let (x, y) = (rng.gen_range(0, M + 1), rng.gen_range(0, M + 1));

        if !pos.contains(&(x, y)) {
            pos.insert((x, y));
        }
    }

    return format!(
        "{}\n{}",
        N,
        pos.iter()
            .map(|&(x, y)| format!("{} {}", x, y))
            .collect::<Vec<_>>()
            .join("\n")
    );
}

fn calc_score_inner(input: &str, output: &str) -> usize {
    use proconio::marker::Usize1;
    use proconio::{input, source::once::OnceSource};
    let source = OnceSource::from(input);
    input! {
        from source,
        N: usize,
        XY: [(isize, isize); N],
    }
    let source = OnceSource::from(output);
    input! {
        from source,
        route: [Usize1; N+1],
    }
    let mut score = 0;

    let dist = |(x1, y1), (x2, y2)| {
        (((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) as f64)
            .sqrt()
            .round() as usize
    };

    for i in 0..N {
        score += dist(XY[route[i]], XY[route[i + 1]]);
    }

    return score;
}
