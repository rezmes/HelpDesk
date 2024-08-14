
// import * as React from "react";
// import styles from "./FormHeader.module.scss";
// import { sp } from "@pnp/sp/presets/all";
// import { IProforma } from "../../Modules/Module";
// import DropBox from "../ProjCostTable/DropBox"; // Import the DropBox component

// export interface IFormHeaderProps {
//   onProformaSelect: (selectedProforma: IProforma) => void;
//   parentFormListName: string; // Add this line
// }

// export interface IFormHeaderState {
//   items: IProforma[];
//   selectedItem: IProforma | null;
//   newProforma: { CustomerName: string; ProformaNumber: number };
//   isCreating: boolean;
// }

// export default class FormHeader extends React.Component<IFormHeaderProps, IFormHeaderState> {
//   constructor(props: IFormHeaderProps) {
//     super(props);
//     this.state = {
//       items: [],
//       selectedItem: null,
//       newProforma: { CustomerName: '', ProformaNumber: 0},
//       isCreating: false
//     };
//   }

//   public async componentDidMount() {
//     this.fetchProformas();
//   }

//   private async fetchProformas() {
//     const { parentFormListName } = this.props; // Destructure parentFormListName from this.props
//     try {
//       const items: any[] = await sp.web.lists
//         .getByTitle(parentFormListName)
//         .items.select("ID", "CustomerName", "ProformaNumber", "Created")
//         .orderBy("Created", true)
//         .get<IProforma[]>();

//       const itemsWithDate = items.map((item) => ({
//         ...item,
//         Created: new Date(item.Created)
//       }));

//       console.log("Fetched Proformas: ", itemsWithDate);

//       this.setState({ items: itemsWithDate });
//     } catch (error) {
//       console.error("Error fetching lists", error);
//     }
//   }

//   private handleSelectChange = (value: string) => {
//     const selectedIndex = parseInt(value, 10);

//     if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < this.state.items.length) {
//       const selectedItem = this.state.items[selectedIndex];
//       this.setState({ selectedItem });
//       this.props.onProformaSelect(selectedItem);
//     } else {
//       console.error("Invalid selection index:", selectedIndex);
//     }
//   };

//   private handleSelect = (item: { label: string, value: any }) => {
//     const selectedItem = this.state.items.find(proforma => proforma.ID === item.value);
//     if (selectedItem) {
//       this.setState({ selectedItem });
//       this.props.onProformaSelect(selectedItem);
//     }
//   };

//   private startCreatingProforma = async () => {
//     try {
//       const lastProforma = await sp.web.lists
//         .getByTitle(this.props.parentFormListName)
//         .items.select("ProformaNumber")
//         .orderBy("ProformaNumber", false)
//         .top(1)
//         .get<{ ProformaNumber: string }[]>();

//       const nextProformaNumber = lastProforma.length > 0 ? +lastProforma[0].ProformaNumber + 1 : 1;

//       this.setState({
//         newProforma: { CustomerName: '', ProformaNumber: nextProformaNumber },
//         isCreating: true
//       });
//     } catch (error) {
//       console.error("Error fetching the last Proforma number", error);
//     }
//   };

//   private handleNewProformaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     this.setState((prevState) => ({
//       newProforma: {
//         ...prevState.newProforma,
//         [name]: value
//       }
//     }));
//   };

//   private saveNewProforma = async () => {
//     const { newProforma } = this.state;

//     if (!newProforma.CustomerName.trim() || newProforma.ProformaNumber <= 0) {
//       console.error("Invalid Proforma data");
//       return;
//     }

//     try {
//       const newItem = await sp.web.lists.getByTitle(this.props.parentFormListName).items.add({
//         CustomerName: newProforma.CustomerName,
//         ProformaNumber: newProforma.ProformaNumber
//       });

//       const newProformaWithDate = {
//         ID: newItem.data.ID,
//         CustomerName: newProforma.CustomerName,
//         ProformaNumber: newProforma.ProformaNumber,
//         Created: new Date()
//       };

//       this.setState((prevState) => ({
//         items: [...prevState.items, newProformaWithDate],
//         selectedItem: newProformaWithDate,
//         isCreating: false
//       }));

//       this.props.onProformaSelect(newProformaWithDate);
//     } catch (error) {
//       console.error("Error saving new Proforma", error);
//     }
//   };

//   private cancelCreatingProforma = () => {
//     this.setState({
//       isCreating: false,
//       newProforma: { CustomerName: '', ProformaNumber: 0 }
//     });
//   };

//   private closeSelectedProforma = () => {
//     this.setState({ selectedItem: null });
//     this.props.onProformaSelect(null);
//   };

//    render(): React.ReactElement<IFormHeaderProps> {
//     const { items, isCreating, newProforma, selectedItem } = this.state;
//     const dropBoxOptions = items.map((item, index) => ({
//       label: `${item.CustomerName} - ${item.ProformaNumber}`,
//       value: item.ID
//     }));


//     return (
//       <div className={styles.formHeader}>
//         <h2 className={styles.title}>فرم‌های برآورد هزینه</h2>
//         {isCreating || selectedItem ? (
//           <button aria-label="Close" onClick={isCreating ? this.cancelCreatingProforma : this.closeSelectedProforma}>
//             بستن
//           </button>
//         ) : (
//           <button aria-label="فرم جدید" onClick={this.startCreatingProforma}>فرم جدید</button>
//         )}
//         {isCreating && (
//           <div className={styles.newProformaForm}>
//             <h3>New Proforma</h3>
//             <label>
//               Customer Name:
//               <input
//                 type="text"
//                 name="CustomerName"
//                 value={newProforma.CustomerName}
//                 onChange={this.handleNewProformaChange}
//               />
//             </label>
//             <label>
//               شماره فرم
//               <input type="text" value={newProforma.ProformaNumber} disabled />
//             </label>
//             <button aria-label="Save" onClick={this.saveNewProforma}>Save</button>
//             <button aria-label="Cancel" onClick={this.cancelCreatingProforma}>Cancel</button>
//           </div>
//         )}
//         <label htmlFor="proforma-select" className={styles.label}>انتخاب فرم برآورد هزینه:</label>
//         <DropBox
//           key={new Date().getTime()} // Force re-render by changing the key
//           options={dropBoxOptions}
//           value={selectedItem ? `${selectedItem.CustomerName} - ${selectedItem.ProformaNumber}` : ''}
//           onChange={this.handleSelectChange}
//           onSelect={this.handleSelect}
//         />
//       </div>
//     );
//   }
// }
import * as React from "react";
import styles from "./FormHeader.module.scss";
import { sp } from "@pnp/sp/presets/all";
import { IProforma } from "../../Modules/Module";
import { ProformaForm } from "./ProformaForm";
import { ProformaDropdown } from "./ProformaDropdown";

export interface IFormHeaderProps {
  onProformaSelect: (selectedProforma: IProforma) => void;
  parentFormListName: string;
}

export interface IFormHeaderState {
  items: IProforma[];
  selectedItem: IProforma | null;
  newProforma: { CustomerName: string; ProformaNumber: number };
  isCreating: boolean;
}

export default class FormHeader extends React.Component<IFormHeaderProps, IFormHeaderState> {
  constructor(props: IFormHeaderProps) {
    super(props);
    this.state = {
      items: [],
      selectedItem: null,
      newProforma: { CustomerName: '', ProformaNumber: 0},
      isCreating: false
    };
  }

  public async componentDidMount() {
    this.fetchProformas();
  }

  private async fetchProformas() {
    const { parentFormListName } = this.props;

    try {
      const items: any[] = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.select("ID", "CustomerName", "ProformaNumber", "Created")
        .orderBy("Created", true)
        .get<IProforma[]>();

      const itemsWithDate = items.map((item) => ({
        ...item,
        Created: new Date(item.Created)
      }));

      console.log("Fetched Proformas: ", itemsWithDate);

      this.setState({ items: itemsWithDate });
    } catch (error) {
      console.error("Error fetching lists", error);
    }
  }

  private handleSelectChange = (value: string) => {
    const selectedIndex = parseInt(value, 10);

    if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < this.state.items.length) {
      const selectedItem = this.state.items[selectedIndex];
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    } else {
      console.error("Invalid selection index:", selectedIndex);
    }
  };

  private handleSelect = (item: { label: string, value: any }) => {
    const selectedItem = this.state.items.find(proforma => proforma.ID === item.value);
    if (selectedItem) {
      this.setState({ selectedItem });
      this.props.onProformaSelect(selectedItem);
    }
  };

  private startCreatingProforma = async () => {
    const { parentFormListName } = this.props;

    try {
      const lastProforma = await sp.web.lists
        .getByTitle(parentFormListName)
        .items.select("ProformaNumber")
        .orderBy("ProformaNumber", false)
        .top(1)
        .get<{ ProformaNumber: string }[]>();

      const nextProformaNumber = lastProforma.length > 0 ? +lastProforma[0].ProformaNumber + 1 : 1;

      this.setState({
        newProforma: { CustomerName: '', ProformaNumber: nextProformaNumber },
        isCreating: true
      });
    } catch (error) {
      console.error("Error fetching the last Proforma number", error);
    }
  };

  private handleNewProformaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newProforma: {
        ...prevState.newProforma,
        [name]: value
      }
    }));
  };

  private saveNewProforma = async () => {
    const { newProforma } = this.state;
    const { parentFormListName } = this.props;

    if (!newProforma.CustomerName.trim() || newProforma.ProformaNumber <= 0) {
      console.error("Invalid Proforma data");
      return;
    }

    try {
      const newItem = await sp.web.lists.getByTitle(parentFormListName).items.add({
        CustomerName: newProforma.CustomerName,
        ProformaNumber: newProforma.ProformaNumber
      });

      const newProformaWithDate = {
        ID: newItem.data.ID,
        CustomerName: newProforma.CustomerName,
        ProformaNumber: newProforma.ProformaNumber,
        Created: new Date()
      };

      this.setState((prevState) => ({
        items: [...prevState.items, newProformaWithDate],
        selectedItem: newProformaWithDate,
        isCreating: false
      }));

      this.props.onProformaSelect(newProformaWithDate);
    } catch (error) {
      console.error("Error saving new Proforma", error);
    }
  };

  private cancelCreatingProforma = () => {
    this.setState({
      isCreating: false,
      newProforma: { CustomerName: '', ProformaNumber: 0 }
    });
  };

  private closeSelectedProforma = () => {
    this.setState({ selectedItem: null });
    this.props.onProformaSelect(null);
  };

  render(): React.ReactElement<IFormHeaderProps> {
    const { items, isCreating, newProforma, selectedItem } = this.state;
    const dropBoxOptions = items.map((item, index) => ({
      label: `${item.CustomerName} - ${item.ProformaNumber}`,
      value: item.ID
    }));

    return (
      <div className={styles.formHeader}>
        <h2 className={styles.title}>فرم‌های برآورد هزینه</h2>
        {isCreating || selectedItem ? (
          <button aria-label="Close" onClick={isCreating ? this.cancelCreatingProforma : this.closeSelectedProforma}>
            بستن
          </button>
        ) : (
          <button aria-label="فرم جدید" onClick={this.startCreatingProforma}>فرم جدید</button>
        )}
        {isCreating && (
          <ProformaForm
            newProforma={newProforma}
            onChange={this.handleNewProformaChange}
            onSave={this.saveNewProforma}
            onCancel={this.cancelCreatingProforma}
          />
        )}
        {!isCreating && (
          <ProformaDropdown
            items={dropBoxOptions}
            selectedItem={selectedItem ? `${selectedItem.CustomerName} - ${selectedItem.ProformaNumber}` : ''}
            onChange={this.handleSelectChange}
            onSelect={this.handleSelect}
          />
        )}
      </div>
    );
  }
}
