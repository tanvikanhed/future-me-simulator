from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/simulate", methods=["POST"])
def simulate():

    data = request.get_json()

    study = data["study"]
    sleep = data["sleep"]
    exercise = data["exercise"]
    screen = data["screen"]
    consistency = data["consistency"]

    # -------------------------------
    # STUDY SCORE - 20 POINTS
    # -------------------------------

    study_score = min(study / 6, 1) * 20


    # -------------------------------
    # SLEEP SCORE - 20 POINTS
    # -------------------------------

    if 7 <= sleep <= 9:
        sleep_score = 20

    elif 6 <= sleep < 7 or 9 < sleep <= 10:
        sleep_score = 15

    else:
        sleep_score = 7


    # -------------------------------
    # EXERCISE SCORE - 15 POINTS
    # -------------------------------

    exercise_score = min(exercise / 60, 1) * 15


    # -------------------------------
    # SCREEN TIME SCORE - 15 POINTS
    # -------------------------------

    if screen <= 2:
        screen_score = 15

    elif screen <= 4:
        screen_score = 12

    elif screen <= 6:
        screen_score = 8

    elif screen <= 8:
        screen_score = 5

    else:
        screen_score = 2


    # -------------------------------
    # CONSISTENCY SCORE - 30 POINTS
    # -------------------------------

    consistency_score = (consistency / 100) * 30


    # -------------------------------
    # CURRENT SCORE
    # -------------------------------

    current = round(
        study_score
        + sleep_score
        + exercise_score
        + screen_score
        + consistency_score
    )


    # -------------------------------
    # FUTURE SCENARIOS
    # -------------------------------

    better = min(current + 12, 100)

    ideal = min(current + 25, 100)


    # -------------------------------
    # CURRENT ROUTINE PROJECTION
    # -------------------------------

    current_30 = min(current + 1, 100)
    current_90 = min(current + 2, 100)
    current_180 = min(current + 3, 100)


    # -------------------------------
    # BETTER ROUTINE PROJECTION
    # -------------------------------

    better_30 = min(better + 3, 100)
    better_90 = min(better + 7, 100)
    better_180 = min(better + 12, 100)


    # -------------------------------
    # IDEAL ROUTINE PROJECTION
    # -------------------------------

    ideal_30 = min(ideal + 5, 100)
    ideal_90 = min(ideal + 12, 100)
    ideal_180 = min(ideal + 20, 100)


    # -------------------------------
    # SEND RESULTS TO JAVASCRIPT
    # -------------------------------

    return jsonify({

        "current": current,

        "better": better,

        "ideal": ideal,

        "current_30": current_30,
        "current_90": current_90,
        "current_180": current_180,

        "better_30": better_30,
        "better_90": better_90,
        "better_180": better_180,

        "ideal_30": ideal_30,
        "ideal_90": ideal_90,
        "ideal_180": ideal_180

    })


if __name__ == "__main__":
    app.run()
