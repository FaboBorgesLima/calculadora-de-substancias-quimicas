import { ChemMolecule } from './chemMolecule';
export class ChemReaction{
    
    private leftSide:ChemMolecule[] = [];
    private rightSide:ChemMolecule[] = [];
    public name:string = "";

    public constructor ( name:string ) {
        this.name = name;
    } 

    public setLeftSide( molecules:ChemMolecule[] ):void {

        this.leftSide = molecules;
    }

    public getLeftSide():ChemMolecule[] {

        return this.leftSide;
    }

    public setRightSide( molecules:ChemMolecule[] ):void {

        this.rightSide = molecules;
    }

    public getRightSide():ChemMolecule[] {

        return this.rightSide;
    }

    public clone():ChemReaction {

        const clone = new ChemReaction( this.name );

        for ( let i:number = 0 ; i < this.leftSide.length ; i++ )
            clone.leftSide[i] = this.leftSide[i].clone();

        for ( let i:number = 0 ; i < this.rightSide.length ; i++ )
            clone.rightSide[i] = this.rightSide[i].clone();

        return clone;
    }

    public isBalanced():boolean {

        let sumLeftSide = this.sumMolecules( this.leftSide ),
            sumRightSide = this.sumMolecules( this.rightSide );

        return sumLeftSide.isEqual( sumRightSide );
    }

    private sumMolecules( molecules:ChemMolecule[] ):ChemMolecule {

        let sum = new ChemMolecule;

        for ( let i:number = 0 ; i < molecules.length ; i++ )
            sum = sum.sum( molecules[i] );

        return sum;
    }

    public setMolsOnMolecule( index:number, quant:number ) {

    }

    public mult( num:number ):ChemReaction {

        const mult = this.clone();

        for ( let i:number = 0 ; i < mult.leftSide.length ; i ++ )
            mult.leftSide[i] = mult.leftSide[i].mult( num );

        for ( let i:number = 0 ; i < mult.rightSide.length ; i ++ )
            mult.rightSide[i] = mult.rightSide[i].mult( num );

        return mult;
    }

    public sumRightSide():ChemMolecule {

        return this.sumMolecules( this.rightSide );
    }

    public sumLeftSide():ChemMolecule {

        return this.sumMolecules( this.leftSide );
    }
}