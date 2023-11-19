export class ChemElement {

    private mass:number = 1;

    private nAtomic:number = 1;

    public atomsMols:number = 1;

    private constructor ( nAtomic:number , mass:number, quant?:number ) {

        this.nAtomic = nAtomic;

        this.mass = mass;

        quant = quant ? quant : 1;

        quant = quant > 0 ? quant : 1;

        this.atomsMols = quant;
    }

    public getNAtomic():number {
        return this.nAtomic;
    }

    static factory( element:string , quant?:number) : ChemElement {

        switch ( element ) {
            //col 1
            case "H" : return new ChemElement( 1, 1 , quant);
            case "Li" : return new ChemElement( 3, 6.9, quant);
            case "Na" : return new ChemElement( 11, 23, quant);
            case "K" : return new ChemElement( 19, 39, quant);
            //col 2
            case "Be" : return new ChemElement( 4, 9 , quant);
            case "Mg" : return new ChemElement( 12, 24 , quant);
            case "Ca" : return new ChemElement( 20, 40 , quant);
            //col 3
            case "B" : return new ChemElement( 5, 10.8, quant);
            case "Al" : return new ChemElement( 13, 26.98 , quant);
            //col 4
            case "C" : return new ChemElement( 6, 12 , quant);
            case "Si" : return new ChemElement( 14, 28.08 , quant);
            //col 5
            case "N" : return new ChemElement( 7, 14 , quant);
            case "P" : return new ChemElement( 15, 30.9 , quant);
            //col 6
            case "O" : return new ChemElement( 8, 16 , quant);
            case "S" : return new ChemElement( 16, 32 , quant);
            //col 7
            case "F" : return new ChemElement( 9, 19 , quant);
            case "Cl" : return new ChemElement( 17, 35.5 , quant);
            case "Br" : return new ChemElement( 35, 79.9 , quant);
            case "I" : return new ChemElement( 53, 126.9 , quant);
        }

        return new ChemElement( 1, 1 , quant);
    }

    public getMass():number {

        return this.mass;
    }

    public getTotalMass():number {

        return this.mass * this.atomsMols;
    }

    public clone():ChemElement {

        const clone = new ChemElement( this.nAtomic,this.mass,this.atomsMols );

        return clone;
    }
}