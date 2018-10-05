import java.io.*;
import java.net.*;
import java.util.*;
import java.lang.*;


public class FileTransfer implements Runnable{

    private ConnectionHandler reciever;
    private ConnectionHandler sender;

    public FileTransfer(ConnectionHandler sender, ConnectionHandler reciever){
        this.reciever = reciever;
        this.sender = sender;
    }

    public void run(){
        try {
            System.out.println("My name is: " + Thread.currentThread().getName());
            Socket recieverClientSocket = reciever.getSocket();
            Socket senderClientSocket = sender.getSocket();
            InputStream recieverInput = recieverClientSocket.getInputStream();
            InputStream senderInput = senderClientSocket.getInputStream();

            BufferedReader indata = new BufferedReader(new InputStreamReader(recieverInput));

            String text;

            while((text = indata.readLine()) != "/Done"){

            if (text.equalsIgnoreCase("yes")){
                String trigger_message = "/OPEN_SOCKET/" + sender.username;
                reciever.sendMessage("You accepted the file");
                sender.sendMessage("Your file transfer request was accepted");
                sender.sendMessage(trigger_message);

            }

            if (text.equalsIgnoreCase("no")){
                reciever.sendMessage("You denied the file");
                sender.sendMessage("Your file transfer request was denied");
                break;
            }

            }
   
        }
        catch(IOException e){e.printStackTrace();}

        }
       
    }
    
