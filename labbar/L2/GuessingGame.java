import java.io.*;
import java.net.*;
import java.util.*;


//Game Mechanics and basic methods that rset game, and returns various booleans
//keep track of guesses and the correct answer
public class GuessingGame{
	public int correct_answer;
	public int number_of_guesses;
	public int times_won;
	public int guess;
	public int upperBound;
	public int lowerBound;

	public void resetGame(int low, int high){
	Random r = new Random();
	this.correct_answer = r.nextInt(high - low) + low;
	this.lowerBound = low;
	this.upperBound = high;
	this.number_of_guesses = 0;
	this.times_won = 0;
	}

	public void generateNewAnswer(int low, int high){
		Random r = new Random();
		this.correct_answer = r.nextInt(high - low) + low;
		this.lowerBound = low;
		this.upperBound = high;
	}

	public boolean isWin(){
		if ((correct_answer == guess) == true){times_won++;}
		return (correct_answer == guess);
	}

	public boolean isLower(){
		return (correct_answer < guess);
	}

	public boolean isHigher(){
		return (correct_answer > guess);
	}

	public void doGuess(int g){
		this.guess = g;
		number_of_guesses++;
	}



}