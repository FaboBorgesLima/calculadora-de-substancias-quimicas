import { ChemElement } from "./chemElement";

export class ChemMolecule{
    
    private elements:ChemElement[] = [];

    private condensedFormula:string = "";

    public mols:number = 1;

    public getElements():ChemElement[] {

        return this.elements;
    }

    public getTotalElements():ChemMolecule {

        let totalElements:ChemMolecule = this.clone();

        totalElements = totalElements.mult( totalElements.mols );

        totalElements.mols = 1;

        return totalElements;
    }

    public mult( num:number ):ChemMolecule {

        const mult = this.clone()

        for ( let i:number = 0; i < mult.elements.length ; i++ ) {

            mult.elements[i].atomsMols *= num;

        }

        return mult;
    }

    public sum( another:ChemMolecule ):ChemMolecule{

        const mainMolecule:ChemMolecule = this.clone().getTotalElements(),
            secondaryMolecule:ChemMolecule = another.clone().getTotalElements();
        const initialSecondaryLength:number = secondaryMolecule.elements.length;

        for ( let i:number = 0 ; i < initialSecondaryLength ; i++ ) {

            const indexOfObject = mainMolecule.elements.findIndex( el => el.getNAtomic() == secondaryMolecule.elements[i].getNAtomic() ) ;

            if ( indexOfObject < 0 ) {

                mainMolecule.elements.push( secondaryMolecule.elements[i] );

                continue;
            }

            mainMolecule.elements[indexOfObject].atomsMols += secondaryMolecule.elements[i].atomsMols;
  
        }

        return mainMolecule;
    }

    public isEqual( to:ChemMolecule ):boolean {
        
        if ( to.elements.length != this.elements.length )
            return false;

        const mass1:number = to.getTotalMass(),
            mass2:number = this.getTotalMass(),
            biggerMass:number = Math.max( mass1, mass2 ),
            lowerMass:number = Math.min( mass1, mass2 ),
            diffPercentage:number = ( biggerMass - lowerMass ) / biggerMass;

        if ( diffPercentage > 1.5 )
            return false;

        if ( to.getSumAtomicNumbers() != this.getSumAtomicNumbers() )
            return false;

        return true;
    }

    public getCondesedFormula():string {

        return this.condensedFormula;
    }

    public setCondensedFormula( condensedFormula:string ):boolean {

        const regex:RegExp = /(H|Li|Na|K|Be|Mg|Ca|B|Al|C|Si|N|P|O|S|F|Cl|Br|I)[0-9]*|\(|\)[0-9]*|\)/g;

        if ( condensedFormula.replace(regex,"") != "" )
        return false;

        let elementsList = condensedFormula.match(regex);

        if ( !elementsList )
            return false;

        this.condensedFormula = condensedFormula;

        this.elements = StringToMoleculeConversor.turnStringArrayToElementArray(elementsList);

        return true;
    }

    public clone():ChemMolecule {

        const clone = new ChemMolecule;
        
        clone.condensedFormula = this.condensedFormula;

        for ( let i:number = 0 ; i < this.elements.length ; i++)
            clone.elements[i] = this.elements[i].clone();

        clone.mols = this.mols;

        return clone;
    }

    public getMass():number {

        let mass:number = 0;

        for ( const el of this.elements ) {

            mass += el.getTotalMass();
        }

        return mass;
    }

    public getTotalMass():number {

        return this.getMass() * this.mols;
    }

    private getSumAtomicNumbers():number {

        let sum:number = 0;

        for ( let i:number = 0 ; i < this.elements.length ; i++)
            sum += this.elements[i].getNAtomic() * this.elements[i].atomsMols;

        return sum;
    }
}

class StringToMoleculeConversor {
    static turnStringArrayToElementArray(elementsList: RegExpMatchArray): ChemElement[] {

        const parenthesisList:number[] = [1],
            newElementArray:ChemElement[] = [];
        let parenthesisMult:number = 1;

        let data = {
            param:"",
            times:1,
            parenthesisList:parenthesisList,
            parenthesisMult:parenthesisMult,
            chemList:newElementArray
        };

        while ( elementsList.length > 0 ) {

            const el = elementsList.pop();

            if ( !el )
                return newElementArray;

            const [ param , times ] = this.splitStringNumber ( el );
            
            data.param = param;

            data.times = times;

            data = this.switchBetweenConversionOptions(data);
            
        }

        return data.chemList;
    }

    private static multiplyValuesOfArray( nums:number[] ):number {

        let mult:number = 1;

        for ( let i:number = 0 ; i < nums.length ; i++ )
            mult *= nums[i];

        return mult;
    }

    private static splitStringNumber( str:string ):[string,number] {

        const onlyStr = str.replace( /[0-9]/g,"" );

        let onlyNumber:number = parseInt( str.replace( /[^0-9]/, "" ) );
        
        onlyNumber = onlyNumber > 0 ? onlyNumber : 1 ;

        return [ onlyStr, onlyNumber ];
    }

    private static switchBetweenConversionOptions( 
        data:{ param:string , 
        times:number , 
        parenthesisList:number[], 
        parenthesisMult:number,
        chemList:ChemElement[] }) : {
            param:string,
            times:number,
            parenthesisList:number[],
            parenthesisMult:number,
            chemList:ChemElement[]} {


        switch ( data.param ) {
            case ("("):
                data.parenthesisList.pop();

                data.parenthesisMult = this.multiplyValuesOfArray( data.parenthesisList );

                return data;

            case(")"):

                data.parenthesisList.push(data.times);

                data.parenthesisMult = this.multiplyValuesOfArray( data.parenthesisList );

                return data;
        }

        const newElement:ChemElement = ChemElement.factory( data.param, data.times * data.parenthesisMult );

        for ( let i:number = 0; i < data.chemList.length ; i++)
            if ( data.chemList[i].getNAtomic() == newElement.getNAtomic() ) {
                data.chemList[i].atomsMols += newElement.atomsMols;
                
                return data;
            }
        
        data.chemList.push( newElement );

        return data;
    }
}