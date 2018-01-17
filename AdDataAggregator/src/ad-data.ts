export function AdData(): JQuery {
    const template: string = "" +
        `<div class='ad-data'>
            <table>
                <thead>
                    <tr>
                        <th>col1</th>
                        <th>col2</th>
                        <th>col3</th>
                   </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>x</td>
                        <td>y</td>
                        <td>z</td>
                    </tr>
                    <tr>
                        <td>x</td>
                        <td>y</td>
                        <td>z</td>
                    </tr>
                    <tr>
                        <td>x</td>
                        <td>y</td>
                        <td>z</td>
                    </tr>
                </tbody>
            </table>
        </div>`;

    return $(template);
}