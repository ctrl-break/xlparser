const schema1 = [
    {
        prop: 'num',
        type: Number,
        // index: 0,
    },
    {
        prop: 'culture',
        type: String,
        // index: 1,
    },
    {
        prop: 'count',
        type: Number,
        // index: 2,
    },
    {
        prop: 'numbOfPot-fr0',
        type: Number,
        // index: 3,
    },
    {
        prop: 'numbOfPot-fr1',
        type: Number,
        // index: 4,
    },    
    {
        prop: 'numbOfPot-fr2',
        type: Number,
        // index: 5,
    },
    {
        prop: 'numbOfPot-fr3',
        type: Number,
        // index: 6,
    },
    {
        prop: 'weight-fr0',
        type: Number,
        // index: 7,
    },
    {
        prop: 'weight-fr1',
        type: Number,
        // index: 8,
    },    
    {
        prop: 'weight-fr2',
        type: Number,
        // index: 9,
    },
    {
        prop: 'weight-fr3',
        type: Number,
        // index: 10,
    },
    {
        prop: 'repeat',
        type: Number,
        // index: 11,
    },
]

const fractions = [
    {
        lower_bound: 0,
        upper_bound: 30,
        id: 0
    },
    {
        lower_bound: 31,
        upper_bound: 50,
        id: 1
    },
    {
        lower_bound: 51,
        upper_bound: 70,
        id: 2
    },
    {
        lower_bound: 71,
        upper_bound: 75,
        id: 3
    },  
]

module.exports = {
    schema1,
    fractions
};
