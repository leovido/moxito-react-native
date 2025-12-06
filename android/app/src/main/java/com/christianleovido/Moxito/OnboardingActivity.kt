package com.christianleovido.Moxito

import android.app.Activity
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

/**
 * OnboardingActivity handles Health Connect onboarding flow.
 * This activity can be launched by Health Connect when users connect the app
 * from within the Health Connect app itself.
 */
class OnboardingActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    val layout = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(48, 48, 48, 48)
    }
    
    val title = TextView(this).apply {
      text = "Welcome to Moxito Health"
      textSize = 24f
      setPadding(0, 0, 0, 32)
    }
    
    val description = TextView(this).apply {
      text = "Connect your health data to track your fitness journey."
      textSize = 16f
      setPadding(0, 0, 0, 32)
    }
    
    val continueButton = Button(this).apply {
      text = "Continue"
      setOnClickListener {
        // Return result to Health Connect
        setResult(Activity.RESULT_OK)
        finish()
      }
    }
    
    layout.addView(title)
    layout.addView(description)
    layout.addView(continueButton)
    
    setContentView(layout)
  }
}

