import { ChemMolecule } from './chemMolecule';
import { ChemElement } from "./chemElement";
import { ChemReaction } from './chemReaction';

const atomTestList: AtomTestI[] = [
        { name:"C", quant: 2, expectedMass: 24, expectedResponse: true },
        { name:"C", quant: 2, expectedMass: 23, expectedResponse: false },
        { name:"C", quant: 1, expectedMass: 12, expectedResponse: true },
    ],
    moleculeTestList: MoleculeTestI[] = [
        { condensed:"CO2", expectedMass:(12+(16*2)), expectedResponse:true },
        { condensed:"CO", expectedMass:(12+(16)), expectedResponse:true },
        { condensed:"CO2", expectedMass:(12+(16)), expectedResponse:false },
        { condensed:"CH3(CH2)3CH3", expectedMass:(72), expectedResponse:true },
        { condensed:"CH3(CH2)3CH3", expectedMass:(71), expectedResponse:false },
    ],
    reactionTestList: RectionTestI[] = [
        { 
            leftSide:["CH4","C2H4"],
            leftSideMols:[1,1],
            rightSide:["C3H8"],
            rightSideMols:[1],
            massOfSides:44,
            expectedResponse: true
        },
        { 
            leftSide:["CH4","C2H4"],
            leftSideMols:[1,1],
            rightSide:["C3H8"],
            rightSideMols:[2],
            massOfSides:88,
            expectedResponse: false
        },
        { 
            leftSide:["NH3","CH3CH2OH"],
            leftSideMols:[1,1],
            rightSide:["CH3CH2NH2","H2O"],
            rightSideMols:[1,1],
            massOfSides:( 46 + 17),
            expectedResponse: true
        },
    ];

console.log("atom test");

for ( let i:number = 0 ; i < atomTestList.length ; i++ )
    console.log( atomTest( atomTestList[i] ) );

console.log("molecule test");

for ( let i:number = 0 ; i < moleculeTestList.length ; i++ )
    console.log( moleculeTest( moleculeTestList[i] ) );

console.log("reaction test");

for ( let i:number = 0 ; i < reactionTestList.length ; i++ )
    console.log( reactionTest( reactionTestList[i] ) );

function atomTest( data : AtomTestI ):string {

    const SHOW_OKAY_TESTS = false;

    const element1:ChemElement = ChemElement.factory( data.name , data.quant );

    const params:string = "\n\tquant: " + data.quant.toString() + 
    "\n\t name: " + data.name + 
    "\n\t expected mass: " + data.expectedMass + 
    "\n\t expected response: " + data.expectedResponse;

    if ( ( element1.getTotalMass() == data.expectedMass ) == data.expectedResponse )
        return "OK " + ( SHOW_OKAY_TESTS ? params : "");

    return "Err : " + params;
}

function moleculeTest( data: MoleculeTestI ):string {

    const SHOW_OKAY_TESTS = false;

    const molecule1 = new ChemMolecule;

    molecule1.setCondensedFormula( data.condensed );

    const params:string = "\n\tcondensed: " + data.condensed +
    "\n\t expected mass: " + data.expectedMass +
    "\n\t expected response: " + data.expectedResponse +
    "\n\t mass: " + molecule1.getTotalMass();

    if ( ( molecule1.getTotalMass() == data.expectedMass ) == data.expectedResponse )
        return "OK " + ( SHOW_OKAY_TESTS ? params : "");

    console.debug( molecule1.getElements() );

    return "Err : " + params;
}

function reactionTest( data: RectionTestI ):string {

    const SHOW_OKAY_TESTS = false;

    const params:string = "\n\tleftSide " + data.leftSide +
    "\n\t rightSide: " + data.rightSide +
    "\n\t expected mass: " + data.massOfSides +
    "\n\t expected response: " + data.expectedResponse;

    const leftSideMolecules: ChemMolecule[] = [],
        rightSideMolecules: ChemMolecule[] = [];

    for ( let i:number = 0 ; i < data.leftSide.length ; i++) {

        const newMolecule = new ChemMolecule;

        newMolecule.setCondensedFormula( data.leftSide[i] );

        newMolecule.mols = data.leftSideMols[i];

        leftSideMolecules.push( newMolecule );
    }

    for ( let i:number = 0 ; i < data.rightSide.length ; i++) {

        const newMolecule = new ChemMolecule;

        newMolecule.setCondensedFormula( data.rightSide[i] );

        newMolecule.mols = data.rightSideMols[i];

        rightSideMolecules.push( newMolecule );
    }

    const test = new ChemReaction("");

    test.setLeftSide( leftSideMolecules );

    test.setRightSide( rightSideMolecules );

    if (  test.isBalanced() != data.expectedResponse ) {

        console.debug( test );

        console.debug( test.getLeftSide() );

        console.debug( test.getRightSide() );

        return "Err: " + params;
    }

    const massSide:number = test.sumRightSide().getMass(),
        upperMassLimit:number = massSide * 1.02,
        lowerMassLimit:number = massSide * 0.98,
        massOtherSide:number = test.sumLeftSide().getMass();
    
    if ( ( massOtherSide < lowerMassLimit || massOtherSide > upperMassLimit ) == data.expectedResponse ) {

        console.debug( upperMassLimit );

        console.debug( massOtherSide );

        console.debug( lowerMassLimit );

        return "Err: " + params;
    }
        
    return "OK " + ( SHOW_OKAY_TESTS ? params : "" );
}

interface MoleculeTestI {
    condensed: string,
    expectedMass: number,
    expectedResponse: boolean 
}

interface AtomTestI {
    name: string,
    quant: number,
    expectedMass: number,
    expectedResponse: boolean
}

interface RectionTestI {
    leftSide: string[],
    rightSide: string[],
    leftSideMols: number[],
    rightSideMols: number[],
    massOfSides: number,
    expectedResponse: boolean
}