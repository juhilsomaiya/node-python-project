import pandas as pd


def main():
    df = pd.read_csv("./uploads/input.csv")

    gkk = df.groupby(['R_fighter', 'B_fighter'])
    data = gkk.first()
    html = data.to_html()
    text_file = open("./views/output.html", "w")
    text_file.write(html)
    text_file.close()

    return True


if __name__ == "__main__":
    main()
