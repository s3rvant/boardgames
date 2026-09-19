"use strict";

const form = document.querySelector("#entry-form");
const output = document.querySelector("#output-log");
const results = document.querySelector("#results-list");

form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Running Tests...";

    try {
    await new Promise(resolve => setTimeout(resolve, 0));
    const data = new FormData(form);
    const dice = {
        black: data.get("black-dice"),
        blue: data.get("blue-dice"),
        red: data.get("red-dice")
    }
    const snails_goal = {
        black: data.get("black-snail"),
        blue: data.get("blue-snail"),
        red: data.get("red-snail")
    }
    const move = data.get("move");
    const tests = Number(data.get("tests"));

    // Clear logs
    output.textContent = 'Starting...';
    results.textContent = 'Waiting...';

    let overall = {
        plunder: {
            lvl1: 0,
            lvl2: 0,
            lvl3: 0,
            lvl4: 0,
            lvl5: 0,
            lvl6: 0
        },
        red: {
            lvl2: 0,
            lvl3: 0,
            lvl4: 0,
            lvl5: 0,
            lvl6: 0,
            lvl7: 0,
            lvl8: 0,
            lvl9: 0,
            lvl10: 0,
            lvl11: 0,
            lvl12: 0
        },
        snails: {
            black: 0,
            blue: 0,
            red: 0
        },
        tide: {
            lvl1: 0,
            lvl2: 0,
            lvl3: 0,
            lvl4: 0,
            lvl5: 0,
            lvl6: 0
        }
    }

    let loop = 0;
    let rest = 0;
    for (let test = 1; test <= tests; test += 1) {
        let plunder = [];
        let red = 0;
        let snails = {
            black: 0,
            blue: 0,
            red: 0
        }
        let tide = 6;
        let winner = '';

        // Continue rolling until a snail wins the race
        let done = false;
        let output_text = '';
        while(done == false){
            let rolls = {
                black: 0,
                blue: 0,
                red: 0
            }
            let text = {
                black: '',
                blue: '',
                red: '',
                snail: '',
                output: ''
            }

            // Roll dice storing results and setting up output text
            for(let i = 1; i <= dice.black; i++){
                var roll = Math.floor(Math.random() * 6) + 1;
                rolls.black += roll;
                text.black += roll + ', ';
                if(!plunder.includes(roll)){
                    plunder.push(roll);
                    overall.plunder[`lvl${roll}`]++;
                }
            }
            text.output += `Black: ${text.black.substring(0, text.black.length - 2)} = ${rolls.black}\n`;
            let blue_max = 1;
            for(let i = 1; i <= dice.blue; i++){
                var roll = Math.floor(Math.random() * 6) + 1;
                rolls.blue += roll;
                text.blue += roll + ', ';
                if(roll > blue_max){
                    blue_max = roll;
                }
            }
            text.output += `Blue: ${text.blue.substring(0, text.blue.length - 2)} = ${rolls.blue}\n`;
            if(blue_max < tide){
                tide = blue_max;
            }
            for(let i = 1; i <= dice.red; i++){
                var roll = Math.floor(Math.random() * 6) + 1;
                rolls.red += roll;
                text.red += roll + ', ';
            }
            text.output += `Red: ${text.red.substring(0, text.red.length - 2)} = ${rolls.red}\n`;
            if(rolls.red > red){
                red = rolls.red;
            }

            // Determine which snail(s) move by highest roll
            if(move == 'Yes'){
                if(rolls.black >= rolls.blue && rolls.black >= rolls.red){
                    snails.black++;
                    text.snail += 'Black, ';
                }
                if(rolls.blue >= rolls.black && rolls.blue >= rolls.red){
                    snails.blue++;
                    text.snail += 'Blue, ';
                }
                if(rolls.red >= rolls.black && rolls.red >= rolls.blue){
                    snails.red++;
                    text.snail += 'Red, ';
                }
            } else {
                if(rolls.black > rolls.blue && rolls.black > rolls.red){
                    snails.black++;
                    text.snail += 'Black, ';
                }
                if(rolls.blue > rolls.black && rolls.blue > rolls.red){
                    snails.blue++;
                    text.snail += 'Blue, ';
                }
                if(rolls.red > rolls.black && rolls.red > rolls.blue){
                    snails.red++;
                    text.snail += 'Red, ';
                }
            }
            text.output += `Snails: ${text.snail.substring(0, text.snail.length - 2)}\n\n`;
            output_text += text.output;

            // Determine if any snail has won
            if(snails.black > snails_goal.black){
                winner += 'Black, ';
                done = true;
                overall.snails.black++;
            }
            if(snails.blue > snails_goal.blue){
                winner += 'Blue, ';
                done = true;
                overall.snails.blue++;
            }
            if(snails.red > snails_goal.red){
                winner += 'Red, ';
                done = true;
                overall.snails.red++;
            }
        }

        // Update overall values
        overall.tide[`lvl${tide}`]++;
        overall.red[`lvl${red}`]++;

        // Update output and results every 1,000 loops
        loop++;
        if(loop == 1000){
            loop = 0;

            // Add mini game totals to output log
            output.textContent = `Test ${test} of ${tests}\n\n`;
            output.textContent += output_text;
            output.textContent += `Winner: ${winner.substring(0, winner.length - 2)}\n`;
            output.textContent += `Tide: ${tide}\n`;
            plunder.sort((a, b) => a - b);
            plunder = plunder.join(', ');
            output.textContent += `Plunder: ${plunder}\n`;
            output.textContent += `Red Max: ${red}`;
            
            // Update overall results as well
            results.textContent = `Test ${test} of ${tests}\n\n`;
            results.textContent += `Tide:\n6x ${overall.tide.lvl6}\n5x ${overall.tide.lvl5}\n4x ${overall.tide.lvl4}\n3x ${overall.tide.lvl3}\n2x ${overall.tide.lvl2}\n1x ${overall.tide.lvl1}\n\n`;
            results.textContent += `Plunder:\n6x ${overall.plunder.lvl6}\n5x ${overall.plunder.lvl5}\n4x ${overall.plunder.lvl4}\n3x ${overall.plunder.lvl3}\n2x ${overall.plunder.lvl2}\n1x ${overall.plunder.lvl1}\n\n`;
            results.textContent += `Snail:\nBlue x ${overall.snails.blue}\nBlack x ${overall.snails.black}\nRed x ${overall.snails.red}\n\n`;
            results.textContent += `Red Max:\n12x ${overall.red.lvl12}\n11x ${overall.red.lvl11}\n10x ${overall.red.lvl10}\n9x ${overall.red.lvl9}\n8x ${overall.red.lvl8}\n7x ${overall.red.lvl7}\n`;
            results.textContent += `6x ${overall.red.lvl6}\n5x ${overall.red.lvl5}\n4x ${overall.red.lvl4}\n3x ${overall.red.lvl3}\n2x ${overall.red.lvl2}`;
        }

        // Sleep 1 millisecond to avoid overworking CPU
        rest++;
        if(rest == 10){
            rest = 0;
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }

    // Always update output and results after final loop

    // Add mini game totals to output log
    output.textContent = `Test ${test} of ${tests}\n\n`;
    output.textContent += output_text;
    output.textContent += `Winner: ${winner.substring(0, winner.length - 2)}\n`;
    output.textContent += `Tide: ${tide}\n`;
    plunder.sort((a, b) => a - b);
    plunder = plunder.join(', ');
    output.textContent += `Plunder: ${plunder}\n`;
    output.textContent += `Red Max: ${red}`;
    
    // Update overall results as well
    results.textContent = `Test ${test} of ${tests}\n\n`;
    results.textContent += `Tide:\n6x ${overall.tide.lvl6}\n5x ${overall.tide.lvl5}\n4x ${overall.tide.lvl4}\n3x ${overall.tide.lvl3}\n2x ${overall.tide.lvl2}\n1x ${overall.tide.lvl1}\n\n`;
    results.textContent += `Plunder:\n6x ${overall.plunder.lvl6}\n5x ${overall.plunder.lvl5}\n4x ${overall.plunder.lvl4}\n3x ${overall.plunder.lvl3}\n2x ${overall.plunder.lvl2}\n1x ${overall.plunder.lvl1}\n\n`;
    results.textContent += `Snail:\nBlue x ${overall.snails.blue}\nBlack x ${overall.snails.black}\nRed x ${overall.snails.red}\n\n`;
    results.textContent += `Red Max:\n12x ${overall.red.lvl12}\n11x ${overall.red.lvl11}\n10x ${overall.red.lvl10}\n9x ${overall.red.lvl9}\n8x ${overall.red.lvl8}\n7x ${overall.red.lvl7}\n`;
    results.textContent += `6x ${overall.red.lvl6}\n5x ${overall.red.lvl5}\n4x ${overall.red.lvl4}\n3x ${overall.red.lvl3}\n2x ${overall.red.lvl2}`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});
