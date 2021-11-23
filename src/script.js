// I included the math.js file in the html and ran it before this,
// so I don't need to worry about node package management

// function test() {
//     return math.evaluate('sqrt(2)');
// }

const matCCheck = document.getElementById("enable_C");
var showC = matCCheck.checked;

function toggleC() {
    showC = matCCheck.checked;
    displayVectors()
}

const matACheck = document.getElementById("enable_A");
var showA = matACheck.checked;

function toggleA() {
    showA = matACheck.checked;
    displayVectors()
}

const matBCheck = document.getElementById("enable_B");
var showB = matBCheck.checked;

function toggleB() {
    showB = matBCheck.checked;
    displayVectors()
}

const vectorCheck = document.getElementById("enable_vector");
var showVector = vectorCheck.checked;

function toggleVector() {
    showVector = vectorCheck.checked;
    displayVectors()
}

function generateMatrix(matFields, mat) {
    
    let exit = false;

    matFields.forEach(field => {

        let val;
        try {
            val = math.evaluate(field.value.trim(), {t: tVariable});
        } catch (e) {
            console.log(e)
            exit = true;
        }

        val = math.evaluate(field.value.trim(), {t: tVariable});
        
        if (typeof val == 'undefined' || typeof val.im !== 'undefined') {
            exit = true;
        }

        let id = field.id;

        let row = parseInt(id[1]);
        let col = parseInt(id[2]);

        if (val !== mat[row][col]) {
            mat[row][col] = val;
            changed = true;
        }
        
    });

    if (exit) {
        return false;
    }

    return true;
}

const matAfields = document.querySelectorAll('[id^="A"]');
var matA = [[null,null,null],[null,null,null],[null,null,null]];
var matAValid = false;

matAfields.forEach(field => {
    field.addEventListener('keyup', (e) => {
        matAValid = generateMatrix(matAfields, matA);
        if (matAValid) {
            displayVectors();
        }
    });
});

const matBfields = document.querySelectorAll('[id^="B"]');
var matB = [[null,null,null],[null,null,null],[null,null,null]];
var matBValid = false;

matBfields.forEach(field => {
    field.addEventListener('keyup', (e) => {
        matBValid = generateMatrix(matBfields, matB);
        if (matBValid) {
            displayVectors();
        }
    });
});

const matCfields = document.querySelectorAll('[id^="C"]');
var matC = [[null,null,null],[null,null,null],[null,null,null]];
var matCValid = false;

matCfields.forEach(field => {
    field.addEventListener('keyup', (e) => {
        matCValid = generateMatrix(matCfields, matC);
        if (matCValid) {
            displayVectors();
        }
    });
});

function invert(mat1, mat2, mat2fields) {
    let temp;
    try {
        temp = math.inv(mat1);
    } catch (e) {
        console.log("failed invert")
        return false;
    }
    
    updateMatrix(temp,mat2,mat2fields);
    displayVectors();
    return true;
}

function matSquare(mat, matFields) {
    let temp;
    try {
        temp = math.multiply(mat,mat);
    } catch (e) {
        console.log("failed square");
        return false;
    }
    
    updateMatrix(temp,mat,matFields);
    displayVectors();
    return true;
}

function updateMatrix(src, dest, matFields) {

    matFields.forEach(field => {
        let id = field.id;

        let row = parseInt(id[1]);
        let col = parseInt(id[2]);

        // at a point, it becomes ridiculous
        // if (math.evaluate(src[row][col], {t: tVariable}) < 1e-7) {
        //     src[row][col] = 0;
        // }

        field.value = src[row][col];
    });

    generateMatrix(matFields, dest);
}

const vectorFields = document.querySelectorAll('[id^="v"]');
var vector = [[null,null,null]];
var vectorValid = false;

vectorFields.forEach(field => {
    field.addEventListener('keyup', (e) => {
        generateVector();
    });
});

function generateVector() {
    let exit = false;

    vectorFields.forEach(field => {

        let val;
        try {
            val = math.evaluate(field.value.trim(), {t: tVariable});
        } catch (e) {
            console.log(e)
            vectorValid = false;
            exit = true;
        }

        val = math.evaluate(field.value.trim(), {t: tVariable});
        
        if (typeof val == 'undefined' || typeof val.im !== 'undefined') {

            vectorValid = false;
            exit = true;
        }

        let id = field.id;

        let row = parseInt(id[1]);
        vector[row] = val;
    });

    if (exit) {
        return;
    }

    vectorValid = true;
    displayVectors();
}

const iHat = [1,0,0];
const jHat = [0,1,0];
const kHat = [0,0,1];

const basisCheck = document.getElementById("enable_basis");
basisCheck.checked = true;
var showBasis = true;

function toggleBasis() {
    showBasis = basisCheck.checked;
    displayVectors()
}

const gridCheck = document.getElementById("enable_grid");

function toggleGrid () {
    displayVectors();
}

var vectorGrid = [];
for (i = -3; i <=3; i++) {
    for (j = -3; j <=3; j++) {
        for (k = -3; k <=3; k++) {
            vectorGrid.push([i,j,k]);
        }
    }
}

var vectorGridTrace = {
    type: 'scatter3d',
    x: [],
    y: [],
    z: [],
    mode: 'markers',
    marker: {
        size: 1,
        color: "rgba(0,0,0,0.6)"
    },
    hoverinfo: "x+y+z"
};

var vectorGridTraces = [];
// inefficient yet simple method, can definitely be reduced to less traces
vectorGrid.forEach(vector => {
    let max_entry = math.max(vector[0], vector[1], vector[2]);
    let trace_color = '';
    if (max_entry == 0) {
        trace_color = "rgb(0,0,0)"
    } else {
        let scaled_255 = 255 / max_entry;
        let r = scaled_255 * vector[0];
        let g = scaled_255 * vector[1];
        let b = scaled_255 * vector[2];
        trace_color = "rbg("+r+","+g+","+b+")"
    }
    vectorGridTraces.push({
        type: 'scatter3d',
        x: [],
        y: [],
        z: [],
        mode: 'markers',
        marker: {
            size: 1,
            color: trace_color
        },
        hoverinfo: "x+y+z"
    });
});


function transform(vec) {
    let result = vec;

    if (showA && matAValid) {
        result = math.multiply(matA, result);
    }

    if (showB && matBValid) {
        result = math.multiply(matB, result);
    }

    if (showC && matCValid) {
        result = math.multiply(matC, result);
    }

    return result;

}

const plotlyDiv = document.getElementById("plot");

const axisGridCheck = document.getElementById("enable_axis_grid");
axisGridCheck.checked = true;

const axesCheck = document.getElementById("enable_axes");
axesCheck.checked = true;

var layout = {
    scene:{
        aspectmode: "manual",
        aspectratio: {
            x: 1, y: 1, z: 1,
        },
        xaxis: {
            nticks: 11,
            range: [-5, 5],
            showticklabels: false,
            showspikes: false,
            showgrid: true,
            zeroline: true
        },
        yaxis: {
            nticks: 11,
            range: [-5, 5],
            showticklabels: false,
            showspikes: false,
            showgrid: true,
            zeroline: true
        },
        zaxis: {
            nticks: 11,
            range: [-5, 5],
            showticklabels: false,
            showspikes: false,
            showgrid: true,
            zeroline: true
        }
    },
    showlegend: false
};
var zoomLevel = 0;
Plotly.newPlot(plotlyDiv, [], layout);

var vectorTrace = {
    type: 'scatter3d',
    x: [],
    y: [],
    z: [],
    mode: 'lines',
    line: {
        width: 5,
        color: "#000000"
    },
    hoverinfo: "x+y+z"
};

var iHatTrace = {
    type: 'scatter3d',
    x: [],
    y: [],
    z: [],
    mode: 'lines',
    line: {
        width: 3,
        color: "#ff0000"
    },
    hoverinfo: "x+y+z"
};

var jHatTrace = {
    type: 'scatter3d',
    x: [],
    y: [],
    z: [],
    mode: 'lines',
    line: {
        width: 3,
        color: "#00ff00"
    },
    hoverinfo: "x+y+z"
};

var kHatTrace = {
    type: 'scatter3d',
    x: [],
    y: [],
    z: [],
    mode: 'lines',
    line: {
        width: 3,
        color: "#0000ff"
    },
    hoverinfo: "x+y+z"
};

function displayVectors() {
    clearDisplay();
    let data = [];

    if (showVector && vectorValid) {
        let vec = transform(vector);
        displayVector(vec, vectorTrace);
        data.push(vectorTrace)
    }

    if (showBasis) {
        let iHatVec = transform(iHat);
        displayVector(iHatVec, iHatTrace);
        data.push(iHatTrace);

        let jHatVec = transform(jHat);
        displayVector(jHatVec, jHatTrace);
        data.push(jHatTrace);

        let kHatVec = transform(kHat);
        displayVector(kHatVec, kHatTrace);
        data.push(kHatTrace);
    }

    if (gridCheck.checked) {
        let index = 0;
        vectorGrid.forEach(vector => {
            let transformed_vector = transform(vector);
            // vectorGridTraces[index].x.push(transformed_vector[0]);
            // vectorGridTraces[index].y.push(transformed_vector[1]);
            // vectorGridTraces[index].z.push(transformed_vector[2]);
            // data.push(vectorGridTraces[index]);
            vectorGridTrace.x.push(transformed_vector[0]);
            vectorGridTrace.y.push(transformed_vector[1]);
            vectorGridTrace.z.push(transformed_vector[2]);
        });
        data.push(vectorGridTrace);
    }
    Plotly.react(plotlyDiv, data, layout);
    showLinTransformation();
    return;
}

function displayVector(vector, trace) {
    trace.x.push(0,vector[0]);
    trace.y.push(0,vector[1]);
    trace.z.push(0,vector[2]);
}

function clearDisplay() {
    let traces = [vectorTrace, iHatTrace, jHatTrace, kHatTrace,vectorGridTrace].concat(vectorGridTraces);

    traces.forEach(trace => {
        trace.x = [];
        trace.y = [];
        trace.z = [];
    });
}

function changeGridZoom () {
    zoomLevel = (zoomLevel + 1) % 4;
    scale = 5 * math.pow(2, zoomLevel);
    layout.scene.xaxis.nticks = 2 * scale + 1;
    layout.scene.xaxis.range = [-scale,scale];
    layout.scene.yaxis.nticks = 2 * scale + 1;
    layout.scene.yaxis.range = [-scale,scale];
    layout.scene.zaxis.nticks = 2 * scale + 1;
    layout.scene.zaxis.range = [-scale,scale];
    displayVectors();
}

function toggleAxisGrid () {
    let showAxes = axisGridCheck.checked;
    layout.scene.xaxis.showgrid = showAxes;
    layout.scene.yaxis.showgrid = showAxes;
    layout.scene.zaxis.showgrid = showAxes;
    displayVectors();
}

function toggleAxes () {
    let showAxes = axesCheck.checked;
    layout.scene.xaxis.zeroline = showAxes;
    layout.scene.yaxis.zeroline = showAxes;
    layout.scene.zaxis.zeroline = showAxes;
    displayVectors()
}

const tSlider = document.getElementById("t_var");
const tLabel = document.getElementById("t_label");

var tVariable = tSlider.value / 100;

function sliderUpdate() {
    tVariable = tSlider.value / 100;
    tLabel.innerText = "t = "+tVariable;
    matAValid = generateMatrix(matAfields, matA);
    matBValid = generateMatrix(matBfields, matB);
    matCValid = generateMatrix(matCfields, matC);
    generateVector();
    displayVectors();
}

function generateRandomInt () {
    x = math.floor(5.5 * math.random() - 2);
    x = x == 0 ? 1 : x;
    return x;
}

function generateRandomVector () {
    let x = math.floor(5 * math.random() + 0.5);
    let y = math.floor(5 * math.random() + 0.5);
    let z = math.floor(5 * math.random() + 0.5);
    return [x,y,z];
}

function generateRandomLinCom (vec1, vec2) {
    let alpha = math.floor(5.5 * math.random() - 2);
    let beta = math.floor(5.5 * math.random() - 2);
    return math.add(math.multiply(alpha,vec1),math.multiply(beta,vec2));
}

function normalizeVector (vec) {
    let magnitude = math.norm(vec);
    return math.divide(vec, magnitude);
}

function generatePresetMatrix (choice) {
    let mat = [[null,null,null],[null,null,null],[null,null,null]]
    switch(choice) {
        case 0: // Rotation
            let rotMat = [["cos(2pi*t)","-sin(2pi*t)",0],["sin(2pi*t)","cos(2pi*t)",0],[0,0,1]];
            let randomStart = math.floor(math.random() * 2.5);
            for (i = 0; i <= 2; i++) {
                mat[i] = rotMat[(i + randomStart) % 3];
            }
            // mat = rotMat;
            break;
        case 1: // Diagonal
            mat = [[generateRandomInt(),0,0],[0,generateRandomInt(),0],[0,0,generateRandomInt()]];
            break;
        case 3: // Lower Triangular
            mat = generatePresetMatrix(1);
            mat[1] = generateRandomLinCom(mat[0],mat[1]);
            mat[2] = generateRandomLinCom(mat[1],mat[2]);
            break;
        case 2: // Upper Triangular
            mat = generatePresetMatrix(1);
            mat[1] = generateRandomLinCom(mat[1],mat[2]);
            mat[0] = generateRandomLinCom(mat[0],mat[1]);
            break;
        case 4: // Symmetric
            mat = [generateRandomVector(),generateRandomVector(),generateRandomVector()];
            for (i = 0; i <= 2; i++) {
                for (j = 0; j <= 2; j++) {
                    if (i < j) {
                        mat[i][j] = mat[j][i];
                    }
                }
            }
            break;
        case 5: // Projection
            let vec1 = generateRandomVector();
            let vec2 = generateRandomVector();
            let vec3 = generateRandomLinCom(vec1, vec2);
            mat = [vec1, vec2, vec3];
            break;
        case 6: // Orthogonal, uses the Gram-Schmidt process
            let bas1 = generateRandomVector();
            let bas2 = generateRandomVector();
            let bas3 = generateRandomVector();

            // saving time on computations
            bas1dotbas1 = math.dot(bas1,bas1);

            // bas2 - proj bas2 onto bas1
            bas2 = math.subtract(bas2, math.multiply(math.dot(bas1,bas2) / bas1dotbas1, bas1));

            bas3 = math.subtract(bas3, math.multiply(math.dot(bas1,bas3) / bas1dotbas1, bas1));
            bas3 = math.subtract(bas3, math.multiply(math.dot(bas2,bas3) / math.dot(bas2,bas2), bas2));

            // bas1 = generateRandomLinCom(generateRandomLinCom(bas1,bas2),bas3);
            // // bas1 = math.equal(bas1,[0,0,0]) ? iHat : bas1;
            // bas2 = generateRandomLinCom(generateRandomLinCom(bas2,bas3),bas1);
            // // bas2 = math.equal(bas2,[0,0,0]) ? jHat : bas2;
            // bas3 = generateRandomLinCom(generateRandomLinCom(bas3,bas1),bas2);
            // // bas3 = math.equal(bas3,[0,0,0]) ? kHat : bas3;
            
            bas1 = normalizeVector(bas1);
            bas2 = normalizeVector(bas2);
            bas3 = normalizeVector(bas3);
            mat = [bas1,bas2,bas3];
            break;
        default:
            console.log("Error: Invalid Preset Selection");

    }
    return mat;
}

function usePresetA (choice) {
    let mat = generatePresetMatrix(choice);
    updateMatrix(mat, matA, matAfields);
    matAValid = true;
    displayVectors();
}

function usePresetB (choice) {
    let mat = generatePresetMatrix(choice);
    updateMatrix(mat, matB, matBfields);
    matBValid = true;
    displayVectors();
}

function usePresetC (choice) {
    let mat = generatePresetMatrix(choice);
    updateMatrix(mat, matC, matCfields);
    matCValid = true;
    displayVectors();
}

const expr = document.getElementById("expr");
const rows = document.querySelectorAll('[id^="row"]');

function showLinTransformation () {
    // let disp = ["|1\t0\t0|","|0\t1\t0|","|0\t0\t1|"];
    let composition = " =";
    let workingMat = [[1,0,0],[0,1,0],[0,0,1]];

    if (showA && matAValid) {
        composition = "A" + composition;
        workingMat = math.multiply(workingMat, matA);
    }

    if (showB && matBValid) {
        composition = "B" + composition;
        workingMat = math.multiply(workingMat, matB);
    }

    if (showC && matCValid) {
        composition = "C" + composition;
        workingMat = math.multiply(workingMat, matC);
    }

    if (composition == " =") {
        composition = "I" + composition;
    }

    expr.innerText = composition;

    rows.forEach(row => {
        let index = row.id[3] - 1;
        row.innerText = workingMat[index][0].toFixed(2)+"\t"+workingMat[index][1].toFixed(2)+"\t"+workingMat[index][2].toFixed(2);
    });
}

showLinTransformation();

sliderUpdate();
displayVectors();