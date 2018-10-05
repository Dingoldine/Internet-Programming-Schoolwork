import java.net.*;
import java.io.*;
import java.util.*;
import java.lang.*;
import java.math.*;

public class Client{
	public final int port;
	public final String host;
	public static URL url = null;
	public static HttpURLConnection con;
	public String cookie;

	private static InputStream InputStream;
	private static OutputStream OutputStream;

	private static PrintStream outToServer;
	private static BufferedReader inFromServer;

	private int timesWon;
	private int number_of_guesses;
	private int lowerBound;
	private int upperBound;

	private int newGuess;


	public Client(String host, int port){
		this.port = port;
		this.host = host;


	}

	public void Connect(){
		try{
		url = new URL("http", host, port, "/");
        con = (HttpURLConnection)url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("Host", "localhost:4711");
     	con.setRequestProperty("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36");
        con.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
        con.setRequestProperty("Accept-Encoding", "Identity");
        con.setRequestProperty("Connection", "keep-alive");
        con.connect();
    }catch(Exception e){
    	e.printStackTrace();
    }

 

    //extract the cookie
    cookie = con.getHeaderField(5);
    System.out.println(cookie);

    con.disconnect(); //disconnect
    
    //Start guess is always 50
    number_of_guesses++;
    String startguess = "/?guess=50";
    playGame(startguess);
    System.out.println("num guess: " + number_of_guesses);
    System.out.println("Average guesses: " + (number_of_guesses/timesWon));
	
    }

    public void setNewGuess(HttpURLConnection con){
    	try{

        //read response content
        InputStream = con.getInputStream();
        inFromServer = new BufferedReader(new InputStreamReader(InputStream));


        String inputLine;
        String[] array = null;
        while ((inputLine = inFromServer.readLine()) != null) {
            if(inputLine.startsWith("<p>")){
            	if((inputLine.startsWith("<p>You"))){
            		timesWon++; 
            		System.out.println("Times won: " + timesWon);
            		newGuess = 50;
            		break;
            	}
            	else{
            	array = inputLine.split(" ");

		        lowerBound = Integer.parseInt(array[4].replaceAll("[\\D]", ""));
		        upperBound = Integer.parseInt(array[6].replaceAll("[\\D]", ""));

		        newGuess = Math.round(((lowerBound + upperBound)/2));
		    }
		    }
		}
		inFromServer.close();
        }catch(IOException e){e.printStackTrace();}



    }

	public void playGame(String req){
		number_of_guesses++;
		try{
			url = new URL("http", host, port, req);
	        con = (HttpURLConnection)url.openConnection();
	        con.setRequestMethod("GET");
	        con.setRequestProperty("Host", "localhost:4711");
	     	con.setRequestProperty("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36");
	        con.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
	        con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
	        con.setRequestProperty("Accept-Encoding", "Identity");
	        con.setRequestProperty("Connection", "keep-alive");
	        con.setRequestProperty("Cookie", cookie);
	        con.connect();
    	}catch(Exception e){e.printStackTrace();}

    	setNewGuess(con);
    	while(timesWon < 100) {
    		playGame("/?guess=" +newGuess);
    	}
    	
    	

		}



    public static void main(String[] args){
    	//connect to startpage 
    	String host = "localhost";
    	int port = 4711;
    	Client c = new Client(host, port);
       	c.Connect();

    }

}
