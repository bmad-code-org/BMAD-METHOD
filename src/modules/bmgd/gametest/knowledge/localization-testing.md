# Localization Testing Guide

## Overview

Localization testing ensures games work correctly across languages, regions, and cultures. Beyond translation, it validates text display, cultural appropriateness, and regional compliance.

## Test Categories

### Linguistic Testing

| Category             | Focus                   | Examples                       |
| -------------------- | ----------------------- | ------------------------------ |
| Translation accuracy | Meaning preserved       | Idioms, game terminology       |
| Grammar/spelling     | Language correctness    | Verb tense, punctuation        |
| Consistency          | Same terms throughout   | "Health" vs "HP" vs "Life"     |
| Context              | Meaning in game context | Item names, skill descriptions |

### Functional Testing

| Category       | Focus                   | Examples                    |
| -------------- | ----------------------- | --------------------------- |
| Text display   | Fits in UI              | Button labels, dialog boxes |
| Font support   | Characters render       | CJK, Cyrillic, Arabic       |
| Text expansion | Longer translations     | German is ~30% longer       |
| RTL support    | Right-to-left languages | Arabic, Hebrew layouts      |

### Cultural Testing

| Category             | Focus              | Examples                  |
| -------------------- | ------------------ | ------------------------- |
| Cultural sensitivity | Offensive content  | Gestures, symbols, colors |
| Regional compliance  | Legal requirements | Ratings, gambling laws    |
| Date/time formats    | Local conventions  | DD/MM/YYYY vs MM/DD/YYYY  |
| Number formats       | Decimal separators | 1,000.00 vs 1.000,00      |

## Test Scenarios

### Text Display

```
SCENARIO: Text Fits UI Elements
  GIVEN all localized strings
  WHEN displayed in target language
  THEN text fits within UI boundaries
  AND no truncation or overflow occurs
  AND text remains readable

SCENARIO: Dynamic Text Insertion
  GIVEN template "Player {name} scored {points} points"
  WHEN name="Alexander" and points=1000
  THEN German: "Spieler Alexander hat 1.000 Punkte erzielt"
  AND text fits UI element
  AND variables are correctly formatted for locale

SCENARIO: Plural Forms
  GIVEN English "1 coin" / "5 coins"
  WHEN displaying in Polish (4 plural forms)
  THEN correct plural form is used
  AND all plural forms are translated
```

### Character Support

```
SCENARIO: CJK Character Rendering
  GIVEN Japanese localization
  WHEN displaying text with kanji/hiragana/katakana
  THEN all characters render correctly
  AND no missing glyphs (tofu boxes)
  AND line breaks respect CJK rules

SCENARIO: Special Characters
  GIVEN text with accented characters (é, ñ, ü)
  WHEN displayed in-game
  THEN all characters render correctly
  AND sorting works correctly

SCENARIO: User-Generated Content
  GIVEN player can name character
  WHEN name includes non-Latin characters
  THEN name displays correctly
  AND name saves/loads correctly
  AND name appears correctly to other players
```

### Layout and Direction

```
SCENARIO: Right-to-Left Layout
  GIVEN Arabic localization
  WHEN viewing UI
  THEN text reads right-to-left
  AND UI elements mirror appropriately
  AND numbers remain left-to-right
  AND mixed content (Arabic + English) displays correctly

SCENARIO: Text Expansion Accommodation
  GIVEN English UI "OK" / "Cancel" buttons
  WHEN localized to German "OK" / "Abbrechen"
  THEN button expands or text size adjusts
  AND button remains clickable
  AND layout doesn't break
```

## Locale-Specific Formatting

### Date and Time

| Locale | Date Format    | Time Format |
| ------ | -------------- | ----------- |
| en-US  | 12/25/2024     | 3:30 PM     |
| en-GB  | 25/12/2024     | 15:30       |
| de-DE  | 25.12.2024     | 15:30 Uhr   |
| ja-JP  | 2024年12月25日 | 15時30分    |

### Numbers and Currency

| Locale | Number   | Currency   |
| ------ | -------- | ---------- |
| en-US  | 1,234.56 | $1,234.56  |
| de-DE  | 1.234,56 | 1.234,56 € |
| fr-FR  | 1 234,56 | 1 234,56 € |
| ja-JP  | 1,234.56 | ¥1,235     |

## Automated Test Examples

### Unity

```csharp
using UnityEngine.Localization;

[Test]
public void Localization_AllKeysHaveTranslations([Values("en", "de", "ja", "zh-CN")] string locale)
{
    var stringTable = LocalizationSettings.StringDatabase
        .GetTable("GameStrings", new Locale(locale));

    foreach (var entry in stringTable)
    {
        Assert.IsFalse(string.IsNullOrEmpty(entry.Value.LocalizedValue),
            $"Missing translation for '{entry.Key}' in {locale}");
    }
}

[Test]
public void TextFits_AllUIElements()
{
    var languages = new[] { "en", "de", "fr", "ja" };

    foreach (var lang in languages)
    {
        LocalizationSettings.SelectedLocale = new Locale(lang);

        foreach (var textElement in FindObjectsOfType<LocalizedText>())
        {
            var rectTransform = textElement.GetComponent<RectTransform>();
            var textComponent = textElement.GetComponent<Text>();

            Assert.LessOrEqual(
                textComponent.preferredWidth,
                rectTransform.rect.width,
                $"Text overflows in {lang}: {textElement.name}");
        }
    }
}

[TestCase("en", 1, "1 coin")]
[TestCase("en", 5, "5 coins")]
[TestCase("ru", 1, "1 монета")]
[TestCase("ru", 2, "2 монеты")]
[TestCase("ru", 5, "5 монет")]
public void Pluralization_ReturnsCorrectForm(string locale, int count, string expected)
{
    var result = Localization.GetPlural("coin", count, locale);
    Assert.AreEqual(expected, result);
}
```

### Unreal

```cpp
bool FLocalizationTest::RunTest(const FString& Parameters)
{
    TArray<FString> Cultures = {"en", "de", "ja", "ko"};

    for (const FString& Culture : Cultures)
    {
        FInternationalization::Get().SetCurrentCulture(Culture);

        // Test critical strings exist
        FText LocalizedText = NSLOCTEXT("Game", "StartButton", "Start");
        TestFalse(
            FString::Printf(TEXT("Missing StartButton in %s"), *Culture),
            LocalizedText.IsEmpty());

        // Test number formatting
        FText NumberText = FText::AsNumber(1234567);
        TestTrue(
            TEXT("Number should be formatted"),
            NumberText.ToString().Len() > 7); // Has separators
    }

    return true;
}
```

### Godot

```gdscript
func test_all_translations_complete():
    var locales = ["en", "de", "ja", "es"]
    var keys = TranslationServer.get_all_keys()

    for locale in locales:
        TranslationServer.set_locale(locale)
        for key in keys:
            var translated = tr(key)
            assert_ne(translated, key,
                "Missing translation for '%s' in %s" % [key, locale])

func test_plural_forms():
    TranslationServer.set_locale("ru")

    assert_eq(tr_n("coin", "coins", 1), "1 монета")
    assert_eq(tr_n("coin", "coins", 2), "2 монеты")
    assert_eq(tr_n("coin", "coins", 5), "5 монет")
    assert_eq(tr_n("coin", "coins", 21), "21 монета")

func test_text_fits_buttons():
    var locales = ["en", "de", "fr"]

    for locale in locales:
        TranslationServer.set_locale(locale)
        await get_tree().process_frame  # Allow UI update

        for button in get_tree().get_nodes_in_group("localized_buttons"):
            var label = button.get_node("Label")
            assert_lt(label.size.x, button.size.x,
                "Button text overflows in %s: %s" % [locale, button.name])
```

## Visual Verification Checklist

### Text Display

- [ ] No truncation in any language
- [ ] Consistent font sizing
- [ ] Proper line breaks
- [ ] No overlapping text

### UI Layout

- [ ] Buttons accommodate longer text
- [ ] Dialog boxes resize appropriately
- [ ] Menu items align correctly
- [ ] Scrollbars appear when needed

### Cultural Elements

- [ ] Icons are culturally appropriate
- [ ] Colors don't have negative connotations
- [ ] Gestures are region-appropriate
- [ ] No unintended political references

## Regional Compliance

### Ratings Requirements

| Region        | Rating Board | Special Requirements      |
| ------------- | ------------ | ------------------------- |
| North America | ESRB         | Content descriptors       |
| Europe        | PEGI         | Age-appropriate icons     |
| Japan         | CERO         | Strict content guidelines |
| Germany       | USK          | Violence restrictions     |
| China         | GRAC         | Approval process          |

### Common Regional Issues

| Issue            | Regions Affected | Solution                 |
| ---------------- | ---------------- | ------------------------ |
| Blood color      | Japan, Germany   | Option for green/disable |
| Gambling imagery | Many regions     | Remove or modify         |
| Skulls/bones     | China            | Alternative designs      |
| Nazi imagery     | Germany          | Remove entirely          |

## Best Practices

### DO

- Test with native speakers
- Plan for text expansion (reserve 30% extra space)
- Use placeholder text during development (Lorem ipsum-style)
- Support multiple input methods (IME for CJK)
- Test all language combinations (UI language + audio language)
- Validate string format parameters

### DON'T

- Hard-code strings in source code
- Assume left-to-right layout
- Concatenate translated strings
- Use machine translation without review
- Forget about date/time/number formatting
- Ignore cultural context of images and icons
