import java.util.*;

class Konto{
    private int saldo;
    Konto(int s){
	saldo=s;
    }

    public boolean taUt(int belopp){
	if(saldo-belopp>0){
	    int nysaldo=saldo-belopp;
	    if(nysaldo!=saldo){
		saldo=nysaldo;
		System.out.println(Thread.currentThread().getName()+" : "+ saldo);
	    }		
	    return true;
	}
	return false;
	
    }

    
    public int visaSaldo(){
	return saldo;
    }
}

class Transaktion extends Thread{
    Konto konto;
    Transaktion(Konto k,String name){
	super(name);
	konto=k;
    }
    public /*synchronized*/ void run(){
	boolean bb=true;
	while (konto.visaSaldo()>0 && bb){
	    Random r=new Random();	    
	    int b=r.nextInt(20);
	    System.out.println(b);
	    bb=konto.taUt(b);
	    try{
	    Thread.sleep(1000);
	    }catch(InterruptedException e){
		System.out.println("Fel!");
	    }
	}
	
    }
}

class Bank{
    public static void main(String[] args){
    Konto k=new Konto(100);
    Transaktion t1 =new Transaktion(k, "1");
    Transaktion t2 =new Transaktion(k,"2");
    t1.start();
    t2.start();
    System.out.println("saldo:"k.visaSaldo());
    }
}
