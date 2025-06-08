import json
import re
from typing import Dict, List, Any, Optional


def extract_questions_from_mcp_response(response_text: str) -> Dict[str, Any]:
    """
    Ultra-robust parser for MCP responses.
    Handles all 3 identified formats with specific fixes for control character issues.
    """
    print(f"=== ULTRA-ROBUST PARSER ===")
    print(f"Raw response length: {len(response_text)}")
    
    try:
        # Step 1: Identify and handle the 3 different formats
        if response_text.strip().startswith('```json'):
            # Format 1 or 3: Markdown-wrapped JSON
            return handle_markdown_wrapped_formats(response_text)
        else:
            # Format 2: Direct JSON with control character issues
            return handle_direct_json_format(response_text)
            
    except Exception as e:
        print(f"Ultra-robust parser failed: {e}")
        return create_error_response(f"Parser error: {str(e)}", response_text)


def handle_markdown_wrapped_formats(response_text: str) -> Dict[str, Any]:
    """Handle Format 1 and Format 3 (markdown-wrapped)"""
    print("Processing markdown-wrapped format")
    
    # Remove markdown
    cleaned = response_text.strip()
    if cleaned.startswith('```json'):
        cleaned = cleaned[7:]
    elif cleaned.startswith('```'):
        cleaned = cleaned[3:]
    if cleaned.endswith('```'):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()
    
    # Apply the same fixes as for direct JSON format
    cleaned = fix_control_characters_in_json(cleaned)
    
    # Parse outer JSON
    try:
        outer_json = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"Failed to parse markdown-wrapped JSON: {e}")
        return create_error_response(f"Markdown JSON parse error: {str(e)}", response_text)
    
    # Navigate to questions
    if "formatted_questions" in outer_json:
        formatted_questions = outer_json["formatted_questions"]
        
        if isinstance(formatted_questions, dict):
            # Format 1: Object format
            print("Detected Format 1: formatted_questions as object")
            return handle_format_1(formatted_questions)
        
        elif isinstance(formatted_questions, str):
            # Format 3: JSON string format
            print("Detected Format 3: formatted_questions as JSON string")
            return handle_format_3(formatted_questions)
    
    elif "get_trivia_questions_response" in outer_json:
        # This is Format 2 but markdown-wrapped
        print("Detected Format 2 (markdown-wrapped): get_trivia_questions_response")
        return handle_format_2_navigation(outer_json)
    
    return create_error_response("Unknown markdown format structure", response_text)


def handle_direct_json_format(response_text: str) -> Dict[str, Any]:
    """Handle Format 2: Direct JSON with control character issues"""
    print("Processing direct JSON format (Format 2)")
    
    # Step 1: Fix control characters while preserving JSON structure
    fixed_json = fix_control_characters_in_json(response_text)
    
    # Step 2: Parse the fixed JSON
    try:
        outer_json = json.loads(fixed_json)
        print("Successfully parsed fixed JSON")
    except json.JSONDecodeError as e:
        print(f"Failed to parse fixed JSON: {e}")
        # Try alternative fixing approach
        return try_alternative_format_2_fix(response_text)
    
    # Step 3: Navigate to questions
    if "get_trivia_questions_response" in outer_json:
        print("Found get_trivia_questions_response")
        return handle_format_2_navigation(outer_json)
    
    return create_error_response("Could not find get_trivia_questions_response", response_text)


def fix_control_characters_in_json(json_str: str) -> str:
    """
    Fix control characters and format issues in JSON while preserving structure.
    
    Issues to fix:
    1. Literal newlines in the "text" field
    2. Improperly escaped single quotes (\'s instead of just 's)
    3. Python boolean values (False/True instead of false/true)
    """
    import re
    
    # First, fix Python booleans to JSON booleans
    fixed = json_str.replace('"isError": False', '"isError": false')
    fixed = fixed.replace('"isError": True', '"isError": true')
    
    # Then fix issues in the text field content
    def fix_text_field(match):
        before_text = match.group(1)  # "text": "
        text_content = match.group(2)  # The actual content
        after_text = match.group(3)    # ", "type": "text"
        
        # Fix the text content
        fixed_content = text_content
        
        # Fix improperly escaped single quotes - remove the escape
        # In JSON strings, single quotes don't need escaping
        fixed_content = fixed_content.replace("\\'", "'")
        
        # Fix literal newlines by escaping them properly
        fixed_content = fixed_content.replace('\n', '\\n')
        
        # Fix literal tabs
        fixed_content = fixed_content.replace('\t', '\\t')
        
        # Fix literal carriage returns
        fixed_content = fixed_content.replace('\r', '\\r')
        
        return f'{before_text}{fixed_content}{after_text}'
    
    # Pattern to match: "text": "(content)", "type": "text"
    pattern = r'("text":\s*")(.*?)(",\s*"type":\s*"text")'
    
    fixed = re.sub(pattern, fix_text_field, fixed, flags=re.DOTALL)
    
    return fixed


def try_alternative_format_2_fix(response_text: str) -> Dict[str, Any]:
    """Alternative approach for Format 2 when first fix fails"""
    print("Trying alternative Format 2 fix")
    
    # Just apply the same fix again - sometimes it works on second try
    fixed_json = fix_control_characters_in_json(response_text)
    
    try:
        outer_json = json.loads(fixed_json)
        print("Alternative fix: JSON parsing successful")
        
        # Navigate to questions
        if "get_trivia_questions_response" in outer_json:
            return handle_format_2_navigation(outer_json)
    
    except json.JSONDecodeError as e:
        print(f"Alternative fix still failed: {e}")
    
    # Final fallback: just extract the questions array using regex
    questions_pattern = r'\[\s*\{[^}]*"question"[^}]*\}(?:\s*,\s*\{[^}]*"question"[^}]*\})*\s*\]'
    match = re.search(questions_pattern, response_text, re.DOTALL)
    
    if match:
        questions_text = match.group(0)
        print(f"Regex fallback found questions: {questions_text[:100]}...")
        
        # Clean control characters in the extracted questions
        cleaned_questions = clean_extracted_questions_text(questions_text)
        
        try:
            questions = json.loads(cleaned_questions)
            if validate_questions_format(questions):
                print(f"Regex fallback successful: {len(questions)} questions")
                return {
                    "success": True,
                    "questions": questions
                }
        except json.JSONDecodeError as e:
            print(f"Regex fallback JSON parse failed: {e}")
    
    return create_error_response("All Format 2 fixes failed", response_text)


def clean_extracted_questions_text(text: str) -> str:
    """Clean extracted questions text for JSON parsing"""
    cleaned = text
    
    # Fix literal control characters
    cleaned = cleaned.replace('\n', '\\n')
    cleaned = cleaned.replace('\t', '\\t')
    cleaned = cleaned.replace('\r', '\\r')
    
    # Fix escape sequences that are already escaped
    cleaned = cleaned.replace('\\\\n', '\\n')
    cleaned = cleaned.replace('\\\\t', '\\t')
    cleaned = cleaned.replace('\\\\r', '\\r')
    cleaned = cleaned.replace('\\\\"', '"')
    cleaned = cleaned.replace('\\\\/', '/')
    
    return cleaned


def handle_format_1(formatted_questions: Dict[str, Any]) -> Dict[str, Any]:
    """Handle Format 1: formatted_questions as object"""
    try:
        # Navigate: formatted_questions -> get_trivia_questions_response -> result -> content[0] -> text
        result = formatted_questions["get_trivia_questions_response"]["result"]
        content = result["content"][0]
        questions_text = content["text"]
        
        # Parse questions
        questions = json.loads(questions_text)
        if validate_questions_format(questions):
            return {
                "success": True,
                "questions": questions
            }
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Format 1 navigation failed: {e}")
    
    return create_error_response("Format 1 processing failed", str(formatted_questions))


def handle_format_2_navigation(outer_json: Dict[str, Any]) -> Dict[str, Any]:
    """Handle Format 2 navigation after JSON is parsed"""
    try:
        # Navigate: get_trivia_questions_response -> result -> content[0] -> text
        result = outer_json["get_trivia_questions_response"]["result"]
        content = result["content"][0]
        questions_text = content["text"]
        
        # Parse questions
        questions = json.loads(questions_text)
        if validate_questions_format(questions):
            return {
                "success": True,
                "questions": questions
            }
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Format 2 navigation failed: {e}")
    
    return create_error_response("Format 2 navigation failed", str(outer_json))


def handle_format_3(formatted_questions_str: str) -> Dict[str, Any]:
    """Handle Format 3: formatted_questions as JSON string"""
    try:
        # First parse the string to get the object
        formatted_obj = json.loads(formatted_questions_str)
        
        # Then navigate like Format 1
        return handle_format_1(formatted_obj)
        
    except json.JSONDecodeError:
        # If direct parsing fails, try cleaning first
        print("Format 3 direct parse failed, trying with cleaning")
        cleaned_str = clean_triple_escaped_json(formatted_questions_str)
        
        try:
            formatted_obj = json.loads(cleaned_str)
            return handle_format_1(formatted_obj)
        except json.JSONDecodeError as e:
            print(f"Format 3 cleaned parse failed: {e}")
            
            # Last resort: regex extraction
            return try_regex_extraction_format_3(formatted_questions_str)


def clean_triple_escaped_json(json_str: str) -> str:
    """Clean JSON string with triple-level escaping"""
    cleaned = json_str
    
    # Handle escaping in order of complexity
    cleaned = cleaned.replace('\\\\"', '"')  # Triple-escaped quotes
    cleaned = cleaned.replace('\\n', '\n')   # Escaped newlines  
    cleaned = cleaned.replace('\\t', '\t')   # Escaped tabs
    cleaned = cleaned.replace('\\r', '\r')   # Escaped carriage returns
    cleaned = cleaned.replace('\\/', '/')    # Escaped forward slashes
    cleaned = cleaned.replace('\\\\', '\\')  # Double backslashes
    
    return cleaned


def try_regex_extraction_format_3(json_str: str) -> Dict[str, Any]:
    """Regex extraction for Format 3 when JSON parsing fails"""
    text_pattern = r'"text":\s*"(\[.*?\])"'
    match = re.search(text_pattern, json_str, re.DOTALL)
    
    if match:
        questions_text = match.group(1)
        cleaned_questions = clean_extracted_questions_text(questions_text)
        
        try:
            questions = json.loads(cleaned_questions)
            if validate_questions_format(questions):
                return {
                    "success": True,
                    "questions": questions
                }
        except json.JSONDecodeError:
            pass
    
    return create_error_response("Format 3 regex extraction failed", json_str)


def validate_questions_format(questions: Any) -> bool:
    """Validate that the parsed questions have the expected format"""
    if not isinstance(questions, list) or len(questions) == 0:
        return False
    
    for question in questions:
        if not isinstance(question, dict):
            return False
        
        required_fields = ["question", "options", "correct_answer", "explanation"]
        if not all(field in question for field in required_fields):
            return False
        
        if not isinstance(question["options"], list) or len(question["options"]) < 2:
            return False
        
        if not isinstance(question["correct_answer"], int):
            return False
    
    return True


def create_error_response(error_msg: str, raw_response: str) -> Dict[str, Any]:
    """Create a standardized error response"""
    return {
        "success": False,
        "error": error_msg,
        "questions": [],
        "raw_response": raw_response[:500] + "..." if len(raw_response) > 500 else raw_response
    }
