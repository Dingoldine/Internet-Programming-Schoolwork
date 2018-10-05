import java.net.*;
import java.io.*;

public class TinnyClient{
    public static void main(String[] args){
	URL url = null;
	try{
	    //	    url = new URL("http","www.nada.kth.se","/cgi-bin/vahid/env.cgi");
	    url = new URL("http","www.nada.kth.se","/~vahid/intnet16/f1.html");
	}catch(MalformedURLException e){
	    System.out.println(e.getMessage());
	}
	HttpURLConnection con = null;
	
	    try{
		con = (HttpURLConnection)url.openConnection();
		con.setRequestProperty("User-Agent","Mozilla");
		con.connect();
		BufferedReader infil = null;
		infil = new BufferedReader(new InputStreamReader(con.getInputStream()));
		String rad = null;
		while( (rad=infil.readLine()) != null){
		    System.out.println(rad);
		}
	    }catch(IOException e){
		System.out.println(e.getMessage());
	    }
	    System.out.println(con.getHeaderField("Content-Type"));
    }
}
