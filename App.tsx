import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Switch,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "react-native";

// === Types ===
type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: any | null;
  description: string;
};

type Menu = {
  starters: MenuItem[];
  main: MenuItem[];
  desserts: MenuItem[];
};

type EditingItem = {
  section: keyof Menu;
  id: string;
  name: string;
  price: string;
  description: string;
};

// === Helper Functions ===
const calculateAverage = (items: MenuItem[]) =>
  items.length
    ? (items.reduce((sum, i) => sum + i.price, 0) / items.length).toFixed(2)
    : "0.00";

// === Main App ===
export default function App() {
  // === State (FIXED) ===
  const [page, setPage] = useState<
    "welcome" | "starters" | "main" | "desserts" | "checkout" | "chef_tools" | "guest_filter"
  >("welcome");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"" | "client" | "chef">("");
  const [order, setOrder] = useState<MenuItem[]>([]);
  const [confirmation, setConfirmation] = useState("");
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  //  FIX: Moved state for persistence across re-renders
  const [filterCourse, setFilterCourse] = useState<keyof Menu | 'all'>('all'); 

  // === Load images ===
  const starters1 = require("./assets/a1.jpg");
  const starters2 = require("./assets/s1.jpg");
  const starters3 = require("./assets/s2.jpg");
  const starters4 = require("./assets/s3.jpg");
  const main1 = require("./assets/m1.jpg");
  const main2 = require("./assets/m2.jpg");
  const main3 = require("./assets/m3.jpg");
  const main4 = require("./assets/m4.jpg");
  const desserts1 = require("./assets/d1.jpg");
  const desserts2 = require("./assets/d2.jpg");
  const desserts3 = require("./assets/d3.jpg");
  const desserts4 = require("./assets/d4.jpg");

  // === Initial Menu State ===
  const [menu, setMenu] = useState<Menu>({
    starters: [
      { id: "s1", name: "Garlic Bread", price: 65, image: starters1, description: "Cheesy and delicious" },
      { id: "s2", name: "Soup of the Day", price: 78, image: starters2, description: "Ask your waiter" },
      { id: "s3", name: "Asparagus wrapped in bacon", price: 62, image: starters3, description: "Oven roasted" },
      { id: "s4", name: "Lettuce wraps with sticky chicken", price: 61, image: starters4, description: "Fresh and light" },
    ],
    main: [
      { id: "m1", name: "Grilled Chicken", price: 175, image: main1, description: "Served with fries" },
      { id: "m2", name: "Pasta Alfredo", price: 129, image: main2, description: "Creamy white sauce" },
      { id: "m3", name: "Bang Bang Burgers", price: 148, image: main3, description: "Our signature double patty" },
      { id: "m4", name: "Tomahawk Steak", price: 110, image: main4, description: "Best cut of meat" },
    ],
    desserts: [
      { id: "d1", name: "Chocolate Cake", price: 90, image: desserts1, description: "Rich and decadent" },
      { id: "d2", name: "Ice Cream", price: 79, image: desserts2, description: "Vanilla or Chocolate" },
      { id: "d3", name: "Apple Cannoli", price: 72, image: desserts3, description: "Italian delight" },
      { id: "d4", name: "Baked Apple Roses", price: 68, image: desserts4, description: "Sweet pastry" },
    ],
  });

  // === Add New Item State ===
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    course: "starters" as keyof Menu,
    price: "",
  });

  // === Menu Editing Functions (Unchanged) ===
  const startEdit = (section: keyof Menu, item: MenuItem) => {
    if (userRole !== "chef") return;
    setEditingItem({
      section,
      id: item.id,
      name: item.name,
      price: String(item.price),
      description: item.description || "",
    });
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const { section, id, name, price, description } = editingItem;
    setMenu((prev) => ({
      ...prev,
      [section]: prev[section].map((it) =>
        it.id === id
          ? { ...it, name: name.trim() || it.name, price: Number(price) || 0, description }
          : it
      ),
    }));
    setEditingItem(null);
  };

  const cancelEdit = () => setEditingItem(null);

  const removeItem = (section: keyof Menu, id: string) => {
    setMenu((prev) => ({
      ...prev,
      [section]: prev[section].filter((i) => i.id !== id),
    }));
  };

  const toggleItem = (item: MenuItem) => {
    setOrder((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  };

  const totalPrice = order.reduce((sum, i) => sum + i.price, 0);

  const confirmAndPay = () => {
    if (!order.length) return;
    setConfirmation(`✅ Payment of R${totalPrice} confirmed! Thank you.`);
    setOrder([]);
  };

  const addMenuItem = () => {
    if (!newItem.name || !newItem.price) return;
    const id = Date.now().toString();
    const itemObj: MenuItem = {
      id,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: parseFloat(newItem.price),
      image: null,
    };
    setMenu((prev) => ({ ...prev, [newItem.course]: [...prev[newItem.course], itemObj] }));
    setNewItem({ name: "", description: "", course: "starters", price: "" });
    setAddOpen(false);
  };

  const avgStarters = calculateAverage(menu.starters);
  const avgMain = calculateAverage(menu.main);
  const avgDesserts = calculateAverage(menu.desserts);

  // === Render Menu Items (Client-side view only - Unchanged) ===
  const renderItems = (section: keyof Menu) => (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.heading}>{section.charAt(0).toUpperCase() + section.slice(1)}</Text>
      {menu[section].map((item) => {
        const isSelected = order.some((i) => i.id === item.id);
        return (
          <View
            key={item.id}
            style={{
              marginBottom: 15,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#f8f8f8",
              borderRadius: 10,
              padding: 10,
              width: "90%",
            }}
          >
            {userRole === "client" && <Switch value={isSelected} onValueChange={() => toggleItem(item)} />}
            {item.image ? (
              <Image source={item.image} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholderBox]}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.text}>• {item.name} - R{item.price}</Text>
              {item.description ? <Text style={styles.descText}>{item.description}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );

  
  //  Chef Tools Screen (Unchanged)
  
  const renderChefTools = () => {
    const allCourses: (keyof Menu)[] = ["starters", "main", "desserts"];
    return (
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={styles.heading}>👨‍🍳 Chef Management</Text>
        
        {/* ADD NEW ITEM SECTION */}
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.button} onPress={() => setAddOpen((s) => !s)}>
            <Text style={styles.buttonText}>{addOpen ? "Close Add Item" : "Add New Menu Item"}</Text>
          </TouchableOpacity>
          {addOpen && (
            <View style={styles.addCard}>
              <Text style={styles.text}>Create New Dish</Text>
              <TextInput style={styles.input} placeholder="Dish Name" value={newItem.name} onChangeText={(t) => setNewItem((prev) => ({ ...prev, name: t }))} />
              <TextInput style={styles.input} placeholder="Description" value={newItem.description} onChangeText={(t) => setNewItem((prev) => ({ ...prev, description: t }))} />
              {Platform.OS === "web" ? (
                <View style={styles.pickerFallback}>
                  {allCourses.map((course) => (
                    <TouchableOpacity key={course} style={[styles.courseButton, newItem.course === course && styles.courseButtonActive]} onPress={() => setNewItem((prev) => ({ ...prev, course: course as keyof Menu }))}>
                      <Text style={styles.courseText}>{course.charAt(0).toUpperCase() + course.slice(1)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Picker selectedValue={newItem.course} onValueChange={(v) => setNewItem((prev) => ({ ...prev, course: v as keyof Menu }))} style={styles.picker}>
                  <Picker.Item label="Starters" value="starters" />
                  <Picker.Item label="Main" value="main" />
                  <Picker.Item label="Desserts" value="desserts" />
                </Picker>
              )}
              <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={newItem.price} onChangeText={(t) => setNewItem((prev) => ({ ...prev, price: t }))} />
              <TouchableOpacity style={[styles.button, { backgroundColor: "green", width: "100%" }]} onPress={addMenuItem}>
                <Text style={styles.buttonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* EDIT/REMOVE EXISTING ITEMS SECTION */}
        <Text style={[styles.heading, { marginTop: 30 }]}>Edit / Remove Items</Text>
        <Text style={styles.note}>Tap items below to edit or remove them.</Text>
        
        {allCourses.map((section) => (
            <View key={section} style={{ width: "90%", marginTop: 15 }}>
                <Text style={[styles.text, { fontWeight: "bold", textAlign: "left" }]}>--- {section.toUpperCase()} ---</Text>
                {menu[section].map((item) => {
                    const isEditing = editingItem && editingItem.id === item.id && editingItem.section === section;
                    return (
                        <View
                            key={item.id}
                            style={{
                                marginBottom: 15,
                                padding: 10,
                                backgroundColor: isEditing ? "#FFEECF" : "#fff",
                                borderRadius: 10,
                                borderWidth: isEditing ? 2 : 0,
                                borderColor: "#FF9800",
                                width: "100%",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            {/* Display/Edit Content */}
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                {!isEditing ? (
                                    <TouchableOpacity onPress={() => startEdit(section, item)} style={{ paddingVertical: 5 }}>
                                        <Text style={styles.text}>• {item.name} - R{item.price}</Text>
                                        {item.description ? <Text style={styles.descText}>{item.description}</Text> : null}
                                    </TouchableOpacity>
                                ) : (
                                    <View>
                                        <TextInput
                                            style={[styles.input, { width: "100%" }]}
                                            value={editingItem.name}
                                            onChangeText={(t) => setEditingItem((prev) => ({ ...prev!, name: t }))}
                                            placeholder="Item name"
                                        />
                                        <TextInput
                                            style={[styles.input, { width: "100%" }]}
                                            value={editingItem.description}
                                            onChangeText={(t) => setEditingItem((prev) => ({ ...prev!, description: t }))}
                                            placeholder="Description"
                                        />
                                        <TextInput
                                            style={[styles.input, { width: "100%" }]}
                                            value={editingItem.price}
                                            onChangeText={(t) => setEditingItem((prev) => ({ ...prev!, price: t }))}
                                            placeholder="Price"
                                            keyboardType="numeric"
                                        />
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                                            <TouchableOpacity style={[styles.button, { width: "31%", backgroundColor: "#4CAF50" }]} onPress={saveEdit}>
                                                <Text style={styles.buttonText}>Save</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.button, { width: "31%", backgroundColor: "#B0B0B0" }]} onPress={cancelEdit}>
                                                <Text style={styles.buttonText}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.button, { width: "31%", backgroundColor: "red" }]} onPress={() => removeItem(section, item.id)}>
                                                <Text style={styles.buttonText}>Remove</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        ))}
      </View>
    );
  };

  
  //  Guest Filter Screen (FIXED)

  const renderGuestFilter = () => {
      const allCourses: (keyof Menu)[] = ["starters", "main", "desserts"];
      
      //  FIX: filterCourse is now read from the App state (no local useState needed)
      const filteredMenu = filterCourse === 'all' 
          ? [...menu.starters, ...menu.main, ...menu.desserts]
          : menu[filterCourse];

      return (
          <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={styles.heading}>🍽️ Filter Menu</Text>

              {/* Filter Buttons */}
              <View style={styles.pickerFallback}>
                  <TouchableOpacity 
                      style={[styles.courseButton, filterCourse === 'all' && styles.courseButtonActive]} 
                      onPress={() => setFilterCourse('all')} //  Now updates the App state
                  >
                      <Text style={styles.courseText}>All Items</Text>
                  </TouchableOpacity>
                  {allCourses.map((course) => (
                      <TouchableOpacity 
                          key={course} 
                          style={[styles.courseButton, filterCourse === course && styles.courseButtonActive]} 
                          onPress={() => setFilterCourse(course)} //  Now updates the App state
                      >
                          <Text style={styles.courseText}>{course.charAt(0).toUpperCase() + course.slice(1)}</Text>
                      </TouchableOpacity>
                  ))}
              </View>

              <Text style={styles.note}>Showing {filteredMenu.length} item(s)</Text>

              {/* Filtered Results */}
              <View style={{ alignItems: "center", width: "100%", marginTop: 20 }}>
                  {filteredMenu.map((item) => {
                      const isSelected = order.some((i) => i.id === item.id);
                      // Determine section for display purposes
                      const itemSection = menu.starters.includes(item) ? 'starters' : menu.main.includes(item) ? 'main' : 'desserts';

                      return (
                          <View
                              key={item.id}
                              style={{
                                  marginBottom: 15,
                                  flexDirection: "row",
                                  alignItems: "center",
                                  backgroundColor: "#f8f8f8",
                                  borderRadius: 10,
                                  padding: 10,
                                  width: "90%",
                              }}
                          >
                              {userRole === "client" && <Switch value={isSelected} onValueChange={() => toggleItem(item)} />}
                              {item.image ? (
                                <Image source={item.image} style={styles.image} />
                              ) : (
                                <View style={[styles.image, styles.placeholderBox]}>
                                  <Text style={styles.placeholderText}>No Image</Text>
                                </View>
                              )}
                              <View style={{ flex: 1, marginLeft: 10 }}>
                                  <Text style={styles.text}>• {item.name} - R{item.price}</Text>
                                  <Text style={styles.descText}>Course: {itemSection.charAt(0).toUpperCase() + itemSection.slice(1)}</Text>
                                  {item.description ? <Text style={styles.descText}>{item.description}</Text> : null}
                              </View>
                          </View>
                      );
                  })}
              </View>
          </View>
      );
  };

  return (
    <View style={[styles.container, { backgroundColor: userRole === "chef" ? "#FFD700" : "#F5F5F5" }]}>
      {/* Hamburger Menu (Unchanged) */}
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        {menuOpen && (
          <View style={styles.dropdown}>
            {/* Base Pages */}
            {["welcome", "starters", "main", "desserts", "checkout"].map((p) => (
              <TouchableOpacity key={p} onPress={() => { setPage(p as any); setMenuOpen(false); setConfirmation(""); }}>
                <Text style={[styles.link, page === p && styles.activeLink]}>
                  {p === "main" ? "Main Course" : p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* NEW: Guest Filter Link */}
            {userRole === "client" && (
                <TouchableOpacity onPress={() => { setPage("guest_filter"); setMenuOpen(false); setConfirmation(""); }}>
                    <Text style={[styles.link, page === "guest_filter" && styles.activeLink]}>Filter Menu</Text>
                </TouchableOpacity>
            )}

            {/* NEW: Chef Tools Link */}
            {userRole === "chef" && (
                <TouchableOpacity onPress={() => { setPage("chef_tools"); setMenuOpen(false); setConfirmation(""); }}>
                    <Text style={[styles.link, page === "chef_tools" && styles.activeLink]}>Chef Tools</Text>
                </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Welcome Page (Unchanged) */}
        {page === "welcome" && (
          <>
            <Text style={styles.heading}>Welcome to FoodHub</Text>
            <Text style={styles.text}>Average Prices:</Text>
            <Text style={styles.text}>Starters: R{avgStarters}</Text>
            <Text style={styles.text}>Main: R{avgMain}</Text>
            <Text style={styles.text}>Desserts: R{avgDesserts}</Text>
            <TouchableOpacity style={styles.button} onPress={() => { setUserRole("client"); setPage("starters"); }}>
              <Text style={styles.buttonText}>Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { setUserRole("chef"); setPage("chef_tools"); }}>
              <Text style={styles.buttonText}>Chef</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Menu Pages (Client View) */}
        {["starters", "main", "desserts"].map((section) =>
          page === section ? renderItems(section as keyof Menu) : null
        )}

        {/* NEW: Chef Tools Page */}
        {page === "chef_tools" && userRole === "chef" && renderChefTools()}

        {/* NEW: Guest Filter Page */}
        {page === "guest_filter" && userRole === "client" && renderGuestFilter()}

        {/* Checkout Page (Unchanged) */}
        {page === "checkout" && (
          <>
            <Text style={styles.heading}>Checkout</Text>
            {order.length === 0 && !confirmation ? (
              <Text>No items selected yet.</Text>
            ) : confirmation ? (
              <Text style={{ color: "green" }}>{confirmation}</Text>
            ) : (
              <>
                {order.map((item) => (
                  <Text key={item.id}>• {item.name} - R{item.price}</Text>
                ))}
                <Text>Total: R{totalPrice}</Text>
                <TouchableOpacity style={[styles.button, { width: 200 }]} onPress={confirmAndPay}>
                  <Text style={styles.buttonText}>Confirm & Pay</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: { flex: 1 },
  menuContainer: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  menuButton: { fontSize: 20, fontWeight: "bold", color: "blue", padding: 8, backgroundColor: "#eee", borderRadius: 6 },
  dropdown: { marginTop: 10, backgroundColor: "#dfdfe6ff", borderRadius: 6, padding: 10 },
  content: { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingVertical: 40 },
  heading: { fontSize: 28, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  text: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  descText: { fontSize: 14, color: "#555", marginTop: 4, textAlign: "left" },
  input: { width: 200, padding: 8, borderWidth: 1, borderColor: "#aaa", borderRadius: 6, fontSize: 16, marginTop: 5, backgroundColor: "white" },
  link: { fontSize: 18, color: "blue", paddingVertical: 6 },
  activeLink: { backgroundColor: "lightblue", borderRadius: 6, paddingHorizontal: 6 },
  button: { backgroundColor: "#333", padding: 10, borderRadius: 6, marginTop: 10, width: "50%", alignItems: "center" },
  buttonText: { color: "white", fontSize: 16 },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 10 },
  placeholderBox: { alignItems: "center", justifyContent: "center", backgroundColor: "#ddd" },
  placeholderText: { color: "#888", fontSize: 12 },
  note: { fontSize: 12, fontStyle: "italic", marginTop: 4, marginBottom: 10 },
  picker: { height: 50, width: 200 },
  pickerFallback: { flexDirection: "row", justifyContent: "center", gap: 6, flexWrap: 'wrap' },
  courseButton: { borderWidth: 1, borderColor: "#888", borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4, margin: 4 },
  courseButtonActive: { backgroundColor: "#d3d3ff" },
  courseText: { fontSize: 14 },
  addCard: { backgroundColor: "#fff", borderRadius: 10, padding: 15, marginTop: 10, alignItems: "center", width: "90%" },
});