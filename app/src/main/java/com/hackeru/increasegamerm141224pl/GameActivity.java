package com.hackeru.increasegamerm141224pl;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class GameActivity extends AppCompatActivity {


    TextView title;
    TextView number;
    Button increaseButton;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_game);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        title = findViewById(R.id.title);
        number = findViewById(R.id.number);
        increaseButton = findViewById(R.id.increaseButton);

        String userName = getIntent().getStringExtra("USER_NAME");

        title.setText("Hello " + userName + "!");
        number.setText("0");

        increaseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int score = Integer.parseInt(number.getText().toString());
                score++; // score = score + 1;
                number.setText(String.valueOf(score));

                if (score >= 10) {
                    Toast.makeText(getApplicationContext(), "You win!", Toast.LENGTH_LONG).show();
                }
            }
        });

    }
}