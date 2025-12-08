package com.christianleovido.Moxito

import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

/**
 * PermissionsRationaleActivity handles the display of Health Connect permissions rationale.
 * This activity is launched when users click the privacy policy link in Health Connect.
 * 
 * Required for:
 * - Android 13 and below: androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE
 * - Android 14+: android.intent.action.VIEW_PERMISSION_USAGE with category HEALTH_PERMISSIONS
 */
class PermissionsRationaleActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    val layout = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(48, 48, 48, 48)
    }
    
    val title = TextView(this).apply {
      text = "Health Connect Permissions"
      textSize = 24f
      setPadding(0, 0, 0, 32)
    }
    
    val description = TextView(this).apply {
      text = """
        Moxito uses Health Connect to access your health and fitness data to:
        
        • Track your steps and distance
        • Monitor your heart rate
        • Provide personalized fitness insights
        
        Your data is stored securely and only used to enhance your fitness experience.
        You can revoke these permissions at any time in Health Connect settings.
      """.trimIndent()
      textSize = 16f
      setPadding(0, 0, 0, 32)
    }
    
    val closeButton = Button(this).apply {
      text = "Close"
      setOnClickListener {
        finish()
      }
    }
    
    layout.addView(title)
    layout.addView(description)
    layout.addView(closeButton)
    
    setContentView(layout)
  }
}

