// ==========================================
// FUTURE ME SIMULATOR
// ==========================================
const resetBtn =
    document.getElementById("resetBtn");
const simulateBtn = document.getElementById("simulateBtn");

const studyInput = document.getElementById("study");
const sleepInput = document.getElementById("sleep");
const exerciseInput = document.getElementById("exercise");
const screenInput = document.getElementById("screen");
const consistencyInput = document.getElementById("consistency");

const currentScore = document.getElementById("currentScore");
const betterScore = document.getElementById("betterScore");
const idealScore = document.getElementById("idealScore");

const insightText = document.getElementById("insightText");

let futureChart = null;

const whatIfBtn = document.getElementById("whatIfBtn");

const whatIfHabit = document.getElementById("whatIfHabit");

const whatIfValue = document.getElementById("whatIfValue");

const whatIfCurrent = document.getElementById("whatIfCurrent");

const whatIfImproved = document.getElementById("whatIfImproved");

const improvementValue =
    document.getElementById("improvementValue");


// ==========================================
// SIMULATE BUTTON
// ==========================================

simulateBtn.addEventListener("click", async function () {

    // Check all fields
    if (
        studyInput.value === "" ||
        sleepInput.value === "" ||
        exerciseInput.value === "" ||
        screenInput.value === "" ||
        consistencyInput.value === ""
    ) {
        alert("Please enter all your habits first.");
        return;
    }


    // Convert input values to numbers
    const study = Number(studyInput.value);
    const sleep = Number(sleepInput.value);
    const exercise = Number(exerciseInput.value);
    const screen = Number(screenInput.value);
    const consistency = Number(consistencyInput.value);


    // ==========================================
    // SEND DATA TO PYTHON
    // ==========================================

    try {

        const response = await fetch("/simulate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                study: study,
                sleep: sleep,
                exercise: exercise,
                screen: screen,
                consistency: consistency

            })

        });


        // Convert Python response into JavaScript object
        const result = await response.json();


        // ==========================================
        // DISPLAY PYTHON RESULTS
        // ==========================================

        currentScore.textContent =
            result.current + "%";

        betterScore.textContent =
            result.better + "%";

        idealScore.textContent =
            result.ideal + "%";


        // ==========================================
        // CREATE FUTURE PROJECTIONS
        // ==========================================

        const currentPath = createProjection(
            result.current,
            "current"
        );

        const betterPath = createProjection(
            result.better,
            "better"
        );

        const idealPath = createProjection(
            result.ideal,
            "ideal"
        );


        // ==========================================
        // CREATE GRAPH
        // ==========================================

        createChart(
            currentPath,
            betterPath,
            idealPath
        );


        // ==========================================
        // GENERATE INSIGHT
        // ==========================================

        generateInsight(
            study,
            sleep,
            exercise,
            screen,
            consistency
        );


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while connecting to Python."
        );

    }

});


// ==========================================
// CREATE FUTURE PROJECTION
// ==========================================

function createProjection(
    startScore,
    scenario
) {

    let day30;
    let day90;
    let day180;


    if (scenario === "current") {

        day30 = startScore + 1;
        day90 = startScore + 2;
        day180 = startScore + 3;

    }

    else if (scenario === "better") {

        day30 = startScore + 3;
        day90 = startScore + 7;
        day180 = startScore + 12;

    }

    else {

        day30 = startScore + 5;
        day90 = startScore + 12;
        day180 = startScore + 20;

    }


    return [

        startScore,

        Math.min(day30, 100),

        Math.min(day90, 100),

        Math.min(day180, 100)

    ];
}


// ==========================================
// CREATE GRAPH
// ==========================================

function createChart(
    currentPath,
    betterPath,
    idealPath
) {

    const chartArea =
        document.getElementById("futureChart");


    // Remove previous chart
    if (futureChart !== null) {

        futureChart.destroy();

    }


    futureChart = new Chart(

        chartArea,

        {

            type: "line",

            data: {

                labels: [
                    "Today",
                    "30 Days",
                    "90 Days",
                    "180 Days"
                ],

                datasets: [

                    {

                        label: "Current Me",

                        data: currentPath,

                        borderWidth: 3,

                        tension: 0.4,

                        pointRadius: 5

                    },

                    {

                        label: "Better Me",

                        data: betterPath,

                        borderWidth: 3,

                        tension: 0.4,

                        pointRadius: 5

                    },

                    {

                        label: "Ideal Me",

                        data: idealPath,

                        borderWidth: 3,

                        tension: 0.4,

                        pointRadius: 5

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                layout: {

                    padding: {

                        top: 15,

                        right: 25,

                        bottom: 15,

                        left: 10

                    }

                },


                interaction: {

                    mode: "index",

                    intersect: false

                },


                scales: {

                    x: {

                        title: {

                            display: true,

                            text: "Time"

                        },

                        ticks: {

                            padding: 8

                        }

                    },


                    y: {

                        min: 0,

                        max: 105,

                        ticks: {

                            stepSize: 20,

                            callback: function(value) {

                                return value + "%";

                            }

                        },

                        title: {

                            display: true,

                            text: "Simulated Progress"

                        }

                    }

                },


                plugins: {

                    legend: {

                        display: true,

                        position: "bottom",

                        labels: {

                            padding: 15

                        }

                    },


                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return (

                                    context.dataset.label +

                                    ": " +

                                    context.parsed.y +

                                    "%"

                                );

                            }

                        }

                    }

                }

            }

        }

    );

}


// ==========================================
// PERSONALIZED INSIGHT
// ==========================================

function generateInsight(
    study,
    sleep,
    exercise,
    screen,
    consistency
) {

    let message;


    if (screen > 7) {

        message =
            "Your screen time is currently one of your biggest improvement areas. Reducing it gradually could create more time for productive activities.";

    }

    else if (study < 2) {

        message =
            "Your study time is relatively low. Increasing it gradually while maintaining consistency could improve your simulated progress.";

    }

    else if (sleep < 6) {

        message =
            "Your sleep duration is quite low. A more consistent sleep routine could support better productivity.";

    }

    else if (exercise < 20) {

        message =
            "Your physical activity is currently low. Adding regular exercise could improve your overall habit score.";

    }

    else if (consistency < 60) {

        message =
            "Consistency is your biggest opportunity. Small improvements repeated regularly can have a stronger effect than occasional large efforts.";

    }

    else {

        message =
            "Your habits are fairly balanced. Maintaining your routine while making small improvements could move you toward your Better Me and Ideal Me paths.";

    }


    insightText.textContent = message;

}

// ==========================================
// WHAT IF SIMULATION
// ==========================================

whatIfBtn.addEventListener("click", async function () {

    if (
        studyInput.value === "" ||
        sleepInput.value === "" ||
        exerciseInput.value === "" ||
        screenInput.value === "" ||
        consistencyInput.value === ""
    ) {

        alert("Please simulate your current habits first.");

        return;
    }


    if (whatIfValue.value === "") {

        alert("Please enter a new value.");

        return;
    }


    const currentHabits = {

        study: Number(studyInput.value),

        sleep: Number(sleepInput.value),

        exercise: Number(exerciseInput.value),

        screen: Number(screenInput.value),

        consistency: Number(consistencyInput.value)

    };


    const newValue = Number(whatIfValue.value);

    const changedHabits = {
        ...currentHabits
    };


    changedHabits[whatIfHabit.value] = newValue;


    try {

        // Calculate current score
        const currentResponse = await fetch(
            "/simulate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(currentHabits)
            }
        );


        const currentResult =
            await currentResponse.json();


        // Calculate changed score
        const changedResponse = await fetch(
            "/simulate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(changedHabits)
            }
        );


        const changedResult =
            await changedResponse.json();


        // Compare 90-day future scores
const currentFuture =
    currentResult.current_90;

const changedFuture =
    changedResult.current_90;

const difference =
    changedFuture - currentFuture;


whatIfCurrent.textContent =
    currentFuture + "%";


whatIfImproved.textContent =
    changedFuture + "%";


if (difference > 0) {

    improvementValue.textContent =
        "+" + difference + " points after 90 days";

}

else if (difference < 0) {

    improvementValue.textContent =
        difference + " points after 90 days";

}

else {

    improvementValue.textContent =
        "No significant change";

}

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to calculate the What If simulation."
        );

    }

});

// ==========================================
// RESET
// ==========================================

resetBtn.addEventListener("click", function () {

    studyInput.value = "";
    sleepInput.value = "";
    exerciseInput.value = "";
    screenInput.value = "";
    consistencyInput.value = "";

    currentScore.textContent = "--%";
    betterScore.textContent = "--%";
    idealScore.textContent = "--%";

    whatIfValue.value = "";

    whatIfCurrent.textContent = "--%";
    whatIfImproved.textContent = "--%";
    improvementValue.textContent = "--";

    insightText.textContent =
        "Enter your habits above and click Simulate My Future to see your projection.";

    if (futureChart !== null) {
        futureChart.destroy();
        futureChart = null;
    }

});