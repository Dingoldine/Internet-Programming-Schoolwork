import java.io.*;
import java.net.*;
import java.lang.Math.*;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

public class ConnectionHandler extends GuessingGame implements Runnable{
  private String clientId;
  private boolean connectionClosed = false;

  private String HtmlString;

  private static Socket socket;
  private static HttpServer server;
  private PrintStream 	response;
  private BufferedReader request;
  private InputStream 	InputStream;
  public OutputStream 	OutputStream;


public ConnectionHandler(HttpServer ser, Socket s){
  		this.socket = s;
  		this.server = ser;
  }

     @Override
  public void run(){

  	 try{
            handleClient();
         }

      catch(IOException e){

        e.printStackTrace();
     }
 }

//If a guess has been made, extract it -> call the update HTML method, otherwise do nothing
 public void parseHttpGetRequest(String s){
 	String theGuessString;
 	int guess;
 	String[] tokens = s.split(" ", 3);
 	if (tokens[1].length() > 1 && !tokens[1].startsWith("/favicon") ){
 		theGuessString = tokens[1].replaceAll("\\W{2}guess=", "");
 		guess = Integer.parseInt(theGuessString);
 		updateHtml(guess);
 	}

 } 

//Play the game by making a guess and update the paragraph accordingly by calling WriteToFile
 public void updateHtml(int g){
 	this.doGuess(g);
 	String paragraph;

 	if (this.isWin()) {
 		paragraph = "<p>You won! Total guesses: " + number_of_guesses +  " Play again!</p>";
 		this.generateNewAnswer(0,100);
 	}

 	else if (this.isLower()){
 		this.upperBound = g;
 		paragraph = "<p>Guess lower! New range: " + lowerBound +" - " + upperBound +"</p>";
 	}
 	else {
 		this.lowerBound = g;
 		paragraph = "<p>Guess higher! New range: " + lowerBound +" - " + upperBound +"</p>";
 	}

	String[] lines = HtmlString.split(System.getProperty("line.separator"));

	for (int i = 0; i < lines.length; i++) {
    	if (lines[i].startsWith("<p>")) {
        	lines[i] = paragraph;
   	 	}
	}

	writeToFile(lines);

 }

//Restores the initial HTML file
 public void resetHTML(){
 	String paragraph = "<p>The Guessing Game: Guess a number in range 0 - 100</p>";

 	String[] lines = HtmlString.split(System.getProperty("line.separator"));

	for (int i = 0; i < lines.length; i++) {
    	if (lines[i].startsWith("<p>")) {
        	lines[i] = paragraph;
   	 	}
	}

	writeToFile(lines);

 }

//Writes the new paragraph to the HTML file
 public synchronized void writeToFile(String[] x){
  BufferedWriter outputWriter;
    try {
        FileOutputStream fos = new FileOutputStream("guess.html", false);
        for (int i = 0; i < x.length; i++) {
    		fos.write(x[i].getBytes());
    		fos.write("\n".getBytes());
  		}

        fos.close();
    } 
    catch(IOException e) {
    	e.printStackTrace();
    }
}

//Check if cookie value exists and if the server remembers it
//if thats the case call restoreSession function
//otherwise create a new  ID and add it to the list
public void ExtractCookie(ArrayList<String> httpBody){
	String identifier = "";
	boolean cookieValueSet = false;
	for(String s : httpBody){
		if(s.startsWith("Cookie: clientId=")){
			identifier = s.replaceAll("Cookie: clientId=", "");

			if(identifier.equals("null")){
				cookieValueSet = false;
			}
			else if (server.sessions.containsKey(identifier)){
				cookieValueSet = true; 
				ConnectionHandler c = server.sessions.get(identifier);
				restoreSession(c);
			}
		}
	}

	if(!cookieValueSet){
		clientId = UUID.randomUUID().toString();
		server.addConnection(clientId, this);
	}
}

//restores important variebles from a remembered session
public void restoreSession(ConnectionHandler c){
	System.out.println("Resoring session...");
	this.number_of_guesses = c.number_of_guesses;
	this.correct_answer = c.correct_answer;
	this.times_won = c.times_won;
	this.clientId = c.clientId;
}

//Handle communication
public void handleClient() throws IOException{
	OutputStream = socket.getOutputStream();
	InputStream  = socket.getInputStream();
	response = new PrintStream(OutputStream);
	request = new BufferedReader(new InputStreamReader(InputStream));
	HtmlString = new String(Files.readAllBytes(Paths.get("guess.html")));
	resetGame(0, 100);
	resetHTML();
	boolean firstRequest = true;
	
	//Splits the Get request from the rest of the body 
	String requestHeader;
	while((requestHeader = request.readLine()) != null){
	String str;
	//System.out.println(requestHeader);
	ArrayList<String> httpBody = new ArrayList<String>();
		while((str = request.readLine()) != null && str.length() > 0){
			httpBody.add(str);
		}

	//if its the first request since connection began, we check for existing cookie value 
	if(firstRequest){firstRequest = false; ExtractCookie(httpBody);}
	
	//parse the request header 
	parseHttpGetRequest(requestHeader);

	File f = new File("guess.html");
	response.flush();
	response.println("HTTP/1.1 200 OK");
	response.println("Content-Type: text/html");
	response.println("Accept Ranges: bytes");
	response.println("Connection: Keep-Alive");
	response.println("Keep-Alive: timeout=100, max=1000");
	response.println("Set-Cookie: clientId="+clientId+";"+"Expires=Wed, 21 Oct 2018 07:28:00 GMT");
	response.println("Content-Length:" + f.length());
	response.println();

	
	FileInputStream infil = new FileInputStream(f);
	byte[] b = new byte[1024];

	while( infil.available() > 0){
	response.write(b,0,infil.read(b));
	}

	}	

	//Closes the connection, adds the connection beforehand to remember user.
	server.addConnection(clientId, this);
	socket.shutdownOutput();
	socket.shutdownInput();
	socket.close();
	}

}
